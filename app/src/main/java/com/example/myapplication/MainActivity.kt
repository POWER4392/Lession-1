package com.example.myapplication

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.core.widget.doAfterTextChanged
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.myapplication.data.Student
import com.example.myapplication.databinding.ActivityMainBinding
import com.example.myapplication.databinding.DialogStudentDetailBinding
import com.example.myapplication.util.confirm
import com.example.myapplication.util.loadAvatar
import com.google.android.material.dialog.MaterialAlertDialogBuilder

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private val viewModel: StudentViewModel by viewModels()
    private val adapter = StudentAdapter { showDetail(it) }

    private var currentList: List<Student> = emptyList()
    private var searchQuery: String = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.rvStudents.layoutManager = LinearLayoutManager(this)
        binding.rvStudents.adapter = adapter

        viewModel.students.observe(this) { list ->
            currentList = list
            filterAndDisplay()
        }

        binding.edtSearch.doAfterTextChanged { text ->
            searchQuery = text?.toString()?.trim().orEmpty()
            filterAndDisplay()
        }

        binding.fabAdd.setOnClickListener {
            startActivity(Intent(this, StudentFormActivity::class.java))
        }
    }

    private fun filterAndDisplay() {
        val filtered = if (searchQuery.isEmpty()) {
            currentList
        } else {
            currentList.filter {
                it.name.contains(searchQuery, ignoreCase = true) ||
                        it.studentCode.contains(searchQuery, ignoreCase = true) ||
                        it.email.contains(searchQuery, ignoreCase = true)
            }
        }

        adapter.submitList(filtered)

        val total = filtered.size
        binding.tvStudentCount.text = getString(R.string.students_subtitle, total)

        if (filtered.isEmpty()) {
            binding.layoutEmpty.visibility = View.VISIBLE
            binding.rvStudents.visibility = View.GONE
        } else {
            binding.layoutEmpty.visibility = View.GONE
            binding.rvStudents.visibility = View.VISIBLE
        }
    }

    /** Trang 2: hộp thoại thông tin chi tiết của Sinh viên. */
    private fun showDetail(student: Student) {
        val d = DialogStudentDetailBinding.inflate(layoutInflater)
        d.imgAvatar.loadAvatar(student.avatar)
        d.tvName.text = student.name
        d.tvCode.text = student.studentCode
        d.tvEmail.text = student.email

        val dialog = MaterialAlertDialogBuilder(this)
            .setView(d.root)
            .create()

        dialog.window?.setBackgroundDrawableResource(android.R.color.transparent)

        d.btnClose.setOnClickListener {
            dialog.dismiss()
        }

        d.btnEdit.setOnClickListener {
            confirm(R.string.confirm_edit) {
                dialog.dismiss()
                startActivity(
                    Intent(this, StudentFormActivity::class.java)
                        .putExtra(StudentFormActivity.EXTRA_STUDENT, student)
                )
            }
        }

        d.btnDelete.setOnClickListener {
            confirm(R.string.confirm_delete) {
                viewModel.delete(student)
                dialog.dismiss()
            }
        }

        dialog.show()
    }
}