import { expect, test } from "@playwright/test";

test.describe("витрина и заказ", () => {
  test("главная показывает УТП и каталог", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Свежее|Фермерская|Ужин/);
    await expect(page.getByText("Самовывоз за 2 часа").first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Акции" }).first()).toBeVisible();
  });

  test("каталог, карточка и корзина", async ({ page }) => {
    await page.goto("/catalog");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Каталог");
    const product = page.locator("article").first();
    const name = await product.locator("a").nth(1).textContent();
    await product.getByRole("button", { name: /Добавить/ }).click();
    await page.goto("/cart");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Корзина");
    if (name) await expect(page.getByText(name.trim()).first()).toBeVisible();
  });

  test("вход в демо-кабинет", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("client@irbis-mart.ru");
    await page.getByLabel("Пароль").fill("Client123!");
    await page.getByRole("button", { name: "Войти" }).click();
    await expect(page).toHaveURL(/\/account/);
    await expect(page.getByText("Бонусный баланс")).toBeVisible();
  });
});
