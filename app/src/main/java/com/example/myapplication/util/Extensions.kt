package com.example.myapplication.util

import android.content.Context
import android.widget.ImageView
import androidx.annotation.StringRes
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import coil.load
import coil.transform.CircleCropTransformation
import com.example.myapplication.R
import java.io.File

/** Hộp thoại xác nhận Có / Không. */
fun Context.confirm(@StringRes message: Int, onYes: () -> Unit) {
    MaterialAlertDialogBuilder(this)
        .setTitle(R.string.dialog_confirm_title)
        .setMessage(message)
        .setPositiveButton(R.string.yes) { _, _ -> onYes() }
        .setNegativeButton(R.string.no, null)
        .show()
}

/** Hiển thị avatar từ link http hoặc đường dẫn file nội bộ. */
fun ImageView.loadAvatar(path: String?) {
    val data: Any? = when {
        path.isNullOrBlank() -> null
        path.startsWith("http", ignoreCase = true) -> path
        else -> File(path)
    }
    load(data) {
        crossfade(true)
        placeholder(R.drawable.ic_person)
        error(R.drawable.ic_person)
        fallback(R.drawable.ic_person)
        transformations(CircleCropTransformation())
    }
}