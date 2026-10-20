# BÀI THỰC HÀNH KIỂM TRA GIỮA KỲ
## MÔN HỌC: PHÁT TRIỂN ỨNG DỤNG DI ĐỘNG

---

### 📌 THÔNG TIN SINH VIÊN & ĐỀ TÀI
- **Họ và tên sinh viên:** (Sinh viên điền họ tên khi nộp)
- **Mã sinh viên (MSSV):** `BIT240148`
- **Đề tài:** **Quản lý Món ăn (Food Manager)**
- **Tên dự án:** `BIT240148_FoodManager`
- **Công nghệ lựa chọn:** React Native (Expo SDK 57, TypeScript)
- **Phương án lưu trữ:**
  - **Local Storage:** `AsyncStorage` (Tổ chức dữ liệu logic quan hệ theo đề bài: 1 Loại - Nhiều Món; 1 Món - Nhiều Ảnh)
  - **Cloud REST API (Điểm 9 - 10):** MockAPI REST Endpoint với cơ chế tự động đồng bộ ngầm Online/Offline
    `https://67b5e43ba9acbdb38ed04db1.mockapi.io/api/v1/BIT240148_Dish`

---

### 💯 ĐÁP ỨNG QUY ĐỊNH ĐẶT TÊN (TRÁNH BỊ TRỪ 1 - 3 ĐIỂM)
Theo quy định đề thi, toàn bộ Model, Bảng/Key và thuộc tính đều được đặt tiền tố `BIT240148_`:
1. **Model & Bảng:**
   - `BIT240148_DishCategory`: Loại món ăn
   - `BIT240148_Dish`: Món ăn
   - `BIT240148_DishImage`: Ảnh món ăn (quan hệ 1 - N)
   - `BIT240148_DishWithDetails`: Đối tượng tổng hợp
   - `BIT240148_FilterCriteria`: Tiêu chí lọc & sắp xếp
2. **Thuộc tính & Trường dữ liệu:**
   - `BIT240148_Id`, `BIT240148_Name`, `BIT240148_Description`
   - `BIT240148_Price`, `BIT240148_PreparationTime`, `BIT240148_IsAvailable`
   - `BIT240148_DishCategoryId`, `BIT240148_ImageUrl`, `BIT240148_IsThumbnail`, `BIT240148_SyncStatus`, v.v.

---

### 🚀 CÁCH CÀI ĐẶT & CHẠY ỨNG DỤNG (DEMO TRÊN EXPO GO)

#### 1. Cài đặt thư viện:
```bash
npm install
```

#### 2. Khởi chạy ứng dụng:
```bash
npx expo start -c
```
*(Nếu điện thoại và máy tính không cùng chung mạng Wi-Fi, dùng: `npx expo start -c --tunnel`)*

#### 3. Mở trên điện thoại:
- Mở app **Expo Go** trên Android hoặc Camera trên iPhone.
- Quét mã QR hiển thị ở màn hình terminal máy tính để xem và thao tác trực tiếp.

---

### 📋 DANH SÁCH TÍNH NĂNG ĐÃ HOÀN THIỆN (THANG ĐIỂM 10/10)

#### 1. Khởi tạo & Dữ liệu ban đầu (Yêu cầu 1)
- [x] Nạp sẵn tối thiểu **03 loại món ăn** (`Appetizers`, `Main Courses`, `Desserts`).
- [x] Nạp sẵn **06 món ăn mẫu** với hình ảnh, giá, thời gian chế biến.
- [x] Trong đó có **05 món đang kinh doanh** và **01 món đã ngừng kinh doanh** (để kiểm thử bộ lọc).

#### 2. Giao diện danh sách & Thẻ món ăn (Yêu cầu 2)
- [x] Hiển thị Thumbnail, Tên món, Loại món, Giá tiền định dạng VNĐ.
- [x] **Huy hiệu Chế biến:** Phân loại tự động `Nhanh (Quick)` nếu thời gian <= 15 phút, `Thường (Regular)` nếu > 15 phút.
- [x] **Huy hiệu Trạng thái:** Nhãn màu xanh `Đang bán` hoặc nhãn xám `Ngừng bán`.
- [x] **Đa ngôn ngữ (Yêu cầu 2.5):** Tiếng Anh (`🇺🇸 EN`) là ngôn ngữ mặc định, có nút chuyển đổi tức thì sang Tiếng Việt (`🇻🇳 VI`) trên Top Bar.

#### 3. Quản lý Thư viện ảnh (Quan hệ 1 - N) (Yêu cầu 3)
- [x] Mỗi món ăn có thể lưu trữ nhiều ảnh.
- [x] Đảm bảo **chỉ có duy nhất 1 ảnh** được đánh dấu làm ảnh đại diện (`IsThumbnail = true`) tại một thời điểm.
- [x] Cho phép thêm ảnh mới qua URL và đổi ảnh đại diện trực tiếp trong màn hình Chi tiết.

#### 4. Lọc & Sắp xếp nâng cao (Yêu cầu 4)
- [x] Tìm kiếm theo từ khóa tên món ăn (Search input).
- [x] Lọc theo Loại món ăn (Category chips).
- [x] Lọc theo Trạng thái kinh doanh (Đang bán / Ngừng bán / Tất cả).
- [x] Lọc theo Khoảng giá (Giá tối thiểu - Giá tối đa).
- [x] Sắp xếp: Giá tăng dần, Giá giảm dần, Tên A-Z, Tên Z-A.
- [x] **Duy trì trạng thái (Yêu cầu 4.2):** Giữ nguyên các tiêu chí lọc/sắp xếp khi chuyển đổi giữa các màn hình.

#### 5. Thêm mới, Chỉnh sửa, Xóa & Ràng buộc toàn vẹn (Yêu cầu 5)
- [x] Form thêm mới và chỉnh sửa món ăn đầy đủ các trường dữ liệu.
- [x] **Validation chặt chẽ:** Tên không rỗng, Giá > 0, Thời gian > 0, Khoảng giá hợp lệ.
- [x] Kiểm tra **không cho phép trùng tên món ăn trong cùng một loại**.
- [x] **Ràng buộc khóa ngoại:** Ngăn chặn xóa Loại món ăn nếu đang có món ăn thuộc loại đó.
- [x] Hộp thoại popup xác nhận trước khi xóa món ăn (`ConfirmModal`).

#### 6. Đồng bộ REST API & Offline Support (Điểm 9 - 10) (Yêu cầu 6)
- [x] Tích hợp MockAPI REST endpoint.
- [x] Tự động đồng bộ ngầm khi có kết nối mạng (hiện trạng thái `Syncing` trên Top Bar).
- [x] **Chế độ Offline:** Khi mất mạng, app vẫn hoạt động bình thường, lưu thao tác vào hàng đợi và tự động đồng bộ lên server khi có mạng trở lại.

---

### 📂 CẤU TRÚC MÃ NGUỒN (MỖI TÍNH NĂNG & MODEL MỘT FILE RIÊNG BIỆT)
```
src/
├── models/                     # Các Data Model độc lập
│   ├── BIT240148_DishCategory.ts
│   ├── BIT240148_Dish.ts
│   ├── BIT240148_DishImage.ts
│   ├── BIT240148_DishWithDetails.ts
│   └── BIT240148_FilterCriteria.ts
├── screens/                    # Các màn hình tính năng
│   ├── BIT240148_DishListScreen.tsx
│   ├── BIT240148_DishDetailScreen.tsx
│   ├── BIT240148_DishFormScreen.tsx
│   └── BIT240148_CategoryScreen.tsx
├── components/                 # Các UI Component tái sử dụng
│   ├── BIT240148_TopAppBar.tsx
│   ├── BIT240148_DishCard.tsx
│   ├── BIT240148_FilterModal.tsx
│   └── BIT240148_ConfirmModal.tsx
├── data/                       # Lưu trữ AsyncStorage & logic quan hệ
│   └── BIT240148_StorageService.ts
├── network/                    # Tích hợp MockAPI & đồng bộ ngầm
│   ├── BIT240148_MockApiClient.ts
│   └── BIT240148_SyncEngine.ts
├── validation/                 # Kiểm tra tính hợp lệ dữ liệu
│   └── BIT240148_DishValidator.ts
└── localization/               # Đa ngôn ngữ EN - VI
    ├── BIT240148_Strings.ts
    └── BIT240148_LanguageContext.tsx
```
