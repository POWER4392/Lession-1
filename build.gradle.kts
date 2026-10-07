plugins {
    alias(libs.plugins.android.application) apply false

    // Thêm dòng này để khai báo KSP cho toàn bộ dự án
    alias(libs.plugins.ksp) apply false
}

