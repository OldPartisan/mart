package ru.irbis.mart;

import android.graphics.Color;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Android 15 draws edge-to-edge by default: pad the WebView and draw
        // a brand status bar behind the system icons.
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        getWindow().setStatusBarColor(Color.TRANSPARENT);
        getWindow().setNavigationBarColor(Color.WHITE);
        getWindow().getDecorView().setBackgroundColor(Color.WHITE);

        WindowInsetsControllerCompat controller =
                WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        controller.setAppearanceLightStatusBars(false);
        controller.setAppearanceLightNavigationBars(true);

        View content = findViewById(android.R.id.content);
        final int left = content.getPaddingLeft();
        final int top = content.getPaddingTop();
        final int right = content.getPaddingRight();
        final int bottom = content.getPaddingBottom();

        ViewCompat.setOnApplyWindowInsetsListener(content, (view, insets) -> {
            Insets bars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            view.setPadding(left, top + bars.top, right, bottom + bars.bottom);
            return insets;
        });

        View statusBarBackground = new View(this);
        statusBarBackground.setBackgroundColor(Color.parseColor("#0F2C16"));
        statusBarBackground.setClickable(false);
        statusBarBackground.setFocusable(false);
        FrameLayout.LayoutParams params =
                new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, Gravity.TOP);
        ((ViewGroup) getWindow().getDecorView()).addView(statusBarBackground, params);

        ViewCompat.setOnApplyWindowInsetsListener(statusBarBackground, (view, insets) -> {
            int height = insets.getInsets(WindowInsetsCompat.Type.statusBars()).top;
            FrameLayout.LayoutParams layoutParams = (FrameLayout.LayoutParams) view.getLayoutParams();
            if (layoutParams.height != height) {
                layoutParams.height = height;
                view.setLayoutParams(layoutParams);
            }
            return insets;
        });
    }
}
