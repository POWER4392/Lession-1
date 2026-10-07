package com.example.myapplication

import android.os.Bundle
import android.util.Patterns
import android.widget.Toast
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.IntentCompat
import androidx.core.widget.doAfterTextChanged
import androidx.lifecycle.lifecycleScope
import com.example.myapplication.data.Student
import com.example.myapplication.databinding.ActivityStudentFormBinding
import com.example.myapplication.util.confirm
import com.example.myapplication.util.loadAvatar
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.io.File

class StudentFormActivity : AppCompatActivity() {

    companion object {
        const val EXTRA_STUDENT = "extra_student"
    }

    private lateinit var binding: ActivityStudentFormBinding
    private val viewModel: StudentViewModel by viewModels()

    private var editingStudent: Student? = null
    private var avatarPath: String? = null

    private val pickImage =
        registerForActivityResult(ActivityResultContracts.PickVisualMedia()) { uri ->
            if (uri == null) return@registerForActivityResult
            lifecycleScope.launch {
                val file = File(filesDir, "avatar_${System.currentTimeMillis()}.jpg")
                withContext(Dispatchers.IO) {
                    contentResolver.openInputStream(uri)?.use { input ->
                        file.outputStream().use { output -> input.copyTo(output) }
                    }
                }
                avatarPath = file.absolutePath
                binding.edtLink.setText("")
                binding.imgAvatar.loadAvatar(avatarPath)
            }
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityStudentFormBinding.inflate(layoutInflater)
        setContentView(binding.root)

        editingStudent = IntentCompat.getSerializableExtra(intent, EXTRA_STUDENT, Student::class.java)

        binding.btnBack.setOnClickListener {
            finish()
        }

        val s = editingStudent
        if (s != null) {
            binding.tvTitle.setText(R.string.title_edit)
            binding.edtName.setText(s.name)
            binding.edtCode.setText(s.studentCode)
            binding.edtEmail.setText(s.email)
            if (s.avatar?.startsWith("http", ignoreCase = true) == true) {
                binding.edtLink.setText(s.avatar)
            } else {
                avatarPath = s.avatar
            }
            binding.imgAvatar.loadAvatar(s.avatar)
        } else {
            binding.tvTitle.setText(R.string.title_add)
            binding.imgAvatar.loadAvatar(null)
        }

        // Chọn ảnh từ thiết bị
        val openPicker = {
            pickImage.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly))
        }
        binding.btnPick.setOnClickListener { openPicker() }
        binding.frameAvatarPicker.setOnClickListener { openPicker() }

        // Nhập link ảnh -> cập nhật xem trước ngay
        binding.edtLink.doAfterTextChanged { text ->
            val link = text?.toString()?.trim().orEmpty()
            if (link.isNotEmpty()) {
                avatarPath = null
                binding.imgAvatar.loadAvatar(link)
            } else if (avatarPath != null) {
                binding.imgAvatar.loadAvatar(avatarPath)
            } else {
                binding.imgAvatar.loadAvatar(null)
            }
        }

        // Xóa thông báo lỗi khi người dùng bắt đầu gõ lại
        binding.edtName.doAfterTextChanged { binding.tilName.error = null }
        binding.edtCode.doAfterTextChanged { binding.tilCode.error = null }
        binding.edtEmail.doAfterTextChanged { binding.tilEmail.error = null }

        binding.btnSave.setOnClickListener { onSaveClicked() }
    }

    private fun onSaveClicked() {
        val name = binding.edtName.text.toString().trim()
        val code = binding.edtCode.text.toString().trim()
        val email = binding.edtEmail.text.toString().trim()
        val link = binding.edtLink.text.toString().trim()

        if (!validate(name, code, email)) return

        val finalAvatar = if (link.isNotEmpty()) link else avatarPath
        val student = Student(
            id = editingStudent?.id ?: 0,
            name = name,
            studentCode = code,
            email = email,
            avatar = finalAvatar
        )

        if (editingStudent != null) {
            // SỬA: Bắt buộc hỏi xác nhận trước khi sửa
            confirm(R.string.confirm_edit) { doSave(student) }
        } else {
            // THÊM MỚI: Lưu trực tiếp
            doSave(student)
        }
    }

    private fun doSave(student: Student) {
        viewModel.save(
            student,
            onDuplicate = {
                binding.tilCode.error = getString(R.string.err_duplicate_code)
                binding.tilCode.requestFocus()
            },
            onDone = {
                Toast.makeText(this, R.string.toast_saved, Toast.LENGTH_SHORT).show()
                finish()
            }
        )
    }

    private fun validate(name: String, code: String, email: String): Boolean {
        var isValid = true

        if (name.isEmpty()) {
            binding.tilName.error = getString(R.string.err_required)
            isValid = false
        } else {
            binding.tilName.error = null
        }

        if (code.isEmpty()) {
            binding.tilCode.error = getString(R.string.err_required)
            isValid = false
        } else {
            binding.tilCode.error = null
        }

        if (email.isEmpty()) {
            binding.tilEmail.error = getString(R.string.err_required)
            isValid = false
        } else if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            binding.tilEmail.error = getString(R.string.err_email)
            isValid = false
        } else {
            binding.tilEmail.error = null
        }

        return isValid
    }
}