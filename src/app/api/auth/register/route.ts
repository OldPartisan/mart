import { eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { bonusTransactions, users } from "@/db/schema";
import { hashPassword, setAuthCookies } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";
import { BONUS_RULES } from "@/lib/bonuses";
import { apiError, apiOk, handleApiError } from "@/lib/api";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

function makeReferralCode(): string {
  return `IRBIS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function POST(request: Request) {
  try {
    const limit = rateLimit(`register:${clientIp(request)}`, 8, 60_000);
    if (!limit.ok) return apiError("Слишком много попыток. Попробуйте через минуту.", 429);

    const data = registerSchema.parse(await request.json());
    const db = await getDb();

    const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, data.email)).limit(1);
    if (existing) return apiError("Аккаунт с таким email уже существует", 409);

    let referredBy: string | null = null;
    if (data.referral) {
      const [referrer] = await db.select().from(users).where(eq(users.referralCode, data.referral.trim().toUpperCase())).limit(1);
      if (referrer) referredBy = referrer.id;
    }

    const passwordHash = await hashPassword(data.password);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + BONUS_RULES.ttlDays * 24 * 60 * 60 * 1000);

    const [user] = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(users)
        .values({
          email: data.email,
          name: data.name,
          phone: data.phone || null,
          passwordHash,
          referralCode: makeReferralCode(),
          referredBy,
          bonusBalance: BONUS_RULES.welcome,
          marketingOptIn: data.marketingOptIn,
        })
        .returning();

      await tx.insert(bonusTransactions).values({
        userId: created.id,
        amount: BONUS_RULES.welcome,
        type: "WELCOME",
        description: "Приветственные бонусы за регистрацию",
        expiresAt,
      });

      if (referredBy) {
        await tx.insert(bonusTransactions).values({
          userId: referredBy,
          amount: BONUS_RULES.referral,
          type: "REFERRAL",
          description: `Бонусы за приглашённого друга (${created.email})`,
          expiresAt,
        });
        await tx
          .update(users)
          .set({ bonusBalance: sql`${users.bonusBalance} + ${BONUS_RULES.referral}` })
          .where(eq(users.id, referredBy));
      }

      return [created];
    });

    await setAuthCookies(user);

    return apiOk(
      {
        user: { id: user.id, name: user.name, email: user.email, bonusBalance: user.bonusBalance },
        message: `Добро пожаловать! Начислили ${BONUS_RULES.welcome} бонусов.`,
      },
      201,
    );
  } catch (error) {
    return handleApiError(error);
  }
}
