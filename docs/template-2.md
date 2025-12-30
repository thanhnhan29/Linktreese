

1. ## **Class Specifications**

   1. ### ***Class User***

Lớp đại diện cho tài khoản người dùng trong hệ thống, quản lý thông tin đăng nhập và trạng thái gói dịch vụ.

* Kế thừa từ: không (None).  
* Danh sách thuộc tính:

| Seq | Property | Modifier | Constraint | Description |
| ----- | :---- | :---- | :---- | :---- |
| 1 | userId | private | PK, Auto Inc | Mã định danh duy nhất của người dùng. |
| 2 | email | private | Unique, Not Null | Địa chỉ email đăng nhập. |
| 3 | password | private | Min 8 chars | Mật khẩu đã mã hóa (Null nếu dùng OAuth). |
| 4 | authProvider | private | Not Null | Nhà cung cấp xác thực (Google, Email). |
| 5 | fullName | private | Max 100 chars | Tên hiển thị đầy đủ. |
| 6 | avatarUrl | private |  | Đường dẫn ảnh đại diện. |
| 7 | proPurchase | private | Default: False | Trạng thái gói cước (True \= Đã mua Pro). |

* Danh sách phương thức chính :

| Seq | Operation | Modifier | Constraint | Description |
| ----- | :---- | :---- | :---- | :---- |
| 1 | register(email, pass) | public | \- | Đăng ký tài khoản mới. |
| 2 | login(email, pass) | public | \- | Xác thực và cấp JWT Token. |
| 3 | updateProfile(data) | public | \- | Cập nhật tên, avatar. |
|  |  |  |  |  |

  2. ### ***Class BioPage***

Thực thể trung tâm của ứng dụng. Đại diện cho trang đích cá nhân, chứa các thiết lập hiển thị và danh sách các block nội dung.

* Kế thừa từ: không (None).  
* Danh sách thuộc tính:

| Seq | Property | Modifier | Constraint | Description |
| ----- | :---- | :---- | :---- | :---- |
| 1 | pageId | private | PK, Auto Inc | Mã định danh trang Bio. |
| 2 | userId | private | FK, Not Null | ID người sở hữu trang. |
| 3 | username | private | Unique, Not Null | Đường dẫn định danh (URL handle). |
| 4 | bioDescription | private | Max 200 chars | Nội dung mô tả ngắn. |
| 5 | isLogoHidden | private | Default: False | Cờ ẩn logo nền tảng (Pro feature). |
| 6 | viewCount | public | Default: 0 | **Cache:** Tổng lượt xem trang (được update bởi Manager). |

* Danh sách phương thức chính :

| Seq | Operation | Modifier | Constraint | Description |
| ----- | :---- | :---- | :---- | :---- |
| 1 | publish() | public | \- | Công khai trang lên internet. |
| 2 | addBlock(type) | public | \- | Thêm khối nội dung mới vào trang. |
| 3 | updateInfo(data) | public | \- | Cập nhật tiêu đề, mô tả. |
| 4 | requestAIGeneration(string) | public | \- | Gửi yêu cầu đến AIService để tạo nội dung. |


  3. ***Class ThemeConfig***

Lớp quản lý các tùy chỉnh về màu sắc, phông chữ và hình nền cho trang Bio.

* Kế thừa từ: không (None).  
* Danh sách thuộc tính:

| Seq | Property | Modifier | Constraint | Description |
| ----- | :---- | :---- | :---- | :---- |
| 1 | pageId | private | PK, FK | Tham chiếu 1-1 với BioPage. |
| 2 | backgroundType | private | Enum | Loại nền (Color, Gradient, Image). |
| 3 | backgroundValue | private | Not Null | Giá trị mã màu hoặc URL ảnh nền. |
| 4 | fontFamily | private | Not Null | Tên phông chữ áp dụng. |
| 5 | buttonStyle | private | Enum | Kiểu nút (Rounded, Square, Outline). |

* Danh sách phương thức chính :

| Seq | Operation | Modifier | Constraint | Description |
| ----- | :---- | :---- | :---- | :---- |
| 1 | applyTheme(id) | public | \- | Áp dụng thông số từ theme mẫu. |
| 2 | updateStyles(data) | public | \- | Ghi đè tùy chỉnh (Custom CSS). |


  4. ***Class Block*** 

Lớp cha định nghĩa các thuộc tính và hành vi chung cho tất cả các loại nội dung trên trang (Link, Ảnh, Video...).

* Kế thừa từ: không (Superclass).  
* Danh sách thuộc tính:

| Seq | Property | Modifier | Constraint | Description |
| ----- | :---- | :---- | :---- | :---- |
| 1 | blockId | protected | PK | Mã định danh khối. |
| 2 | pageId | protected | FK | ID trang chứa khối này. |
| 3 | title | protected | Not Null | Tiêu đề hiển thị. |
| 4 | sortOrder | protected | Integer | Thứ tự sắp xếp. |
| 5 | isVisible | protected | Boolean | Trạng thái hiển thị (Bật/Tắt). |
| 6 | clickCount | public | Default: 0 | **Cache:** Tổng lượt click vào khối. |

* Danh sách phương thức chính:

| Seq | Operation | Modifier | Constraint | Description |
| ----- | :---- | :---- | :---- | :---- |
| 1 | toggle() | public | \- | Đảo ngược trạng thái hiển thị. |
| 2 | reorder(idx) | public | \- | Cập nhật vị trí sắp xếp mới. |
| 3 | delete() | public | \- | Xóa khối khỏi trang. |

  5. ***Class EventAnalyticsManager***

Lớp dịch vụ quản lý luồng dữ liệu thống kê, tách biệt việc ghi log và đọc cache.

* Kế thừa từ: Không (Service Class)..  
* Danh sách thuộc tính: Không có (Stateless Class \- Sử dụng kết nối DB nội bộ).  
* Danh sách phương thức chính :

| Seq | Operation | Modifier | Constraint | Description |
| ----- | :---- | :---- | :---- | :---- |
| 1 | logPageView(pageId) | public | \- | Tạo log view \+ Tăng BioPage.viewCount. |
| 2 | logLinkClick(blockId) | public | \- | Tạo log click \+ Tăng Block.clickCount. |
| 3 | getViewFromBio(pageId) | public | \- | Trả về viewCount từ BioPage (Nhanh). |
| 4 | getViewFromBioLogs(pageId) | public | \- | Query đếm từ AnalyticsEvent (Chậm, chính xác). |
| 5 | getViewFromLink(blockId) | public | \- | Trả về viewCount từ Block(Nhanh). |
| 6 | getViewFromLinkLogs(blockId) | public | \- | Query đếm từ AnalyticsEvent (Chậm, chính xác). |

  6. ***Class AIService***

Lớp tiện ích xử lý các tác vụ thông minh (Tạo nội dung).

* Kế thừa từ: không (Service Class).  
* Danh sách thuộc tính:

| Seq | Property | Modifier | Constraint | Description |
| ----- | :---- | :---- | :---- | :---- |
| 1 | apiKey | private | Not Null | Khóa xác thực API OpenAI/Gemini. |

* Danh sách phương thức chính :

| Seq | Operation | Modifier | Constraint | Description |
| ----- | :---- | :---- | :---- | :---- |
| 1 | rewriteContent(text) | public | \- | Viết lại văn bản cho hấp dẫn hơn. |


  7. ***Class EcommerceBlock***

Hiển thị sản phẩm từ Shopee/Lazada với tính năng lưu cache.

* Kế thừa từ: Block.  
* Danh sách thuộc tính:

| Seq | Property | Modifier | Constraint | Description |
| ----- | :---- | :---- | :---- | :---- |
| 1 | *(Inherited)* | protected | \- | Các thuộc tính của Block (blockId, title...). |
| 2 | productUrl | private | URL | Link gốc sản phẩm. |
| 3 | cachedName | private | \- | Tên sản phẩm lưu cache từ sàn. |
| 4 | cachedImage | private | URL | Ảnh sản phẩm lưu cache từ sàn. |

* Danh sách phương thức chính :

| Seq | Operation | Modifier | Constraint | Description |
| ----- | :---- | :---- | :---- | :---- |
| 1 | refreshData() | public | \- | Crawl lại dữ liệu từ sàn TMĐT để update cache. |


  8. ***Class DonateBlock***

Hiển thị thông tin nhận tiền hoặc quyên góp.

* Kế thừa từ: Block.  
* Danh sách thuộc tính:

| Seq | Property | Modifier | Constraint | Description |
| ----- | :---- | :---- | :---- | :---- |
| 1 | *(Inherited)* | protected | \- | Các thuộc tính của Block. |
| 2 | paymentMethod | private | Enum | Loại ví (Momo, ZaloPay, Bank). |
| 3 | paymentIdentifier | private | Not Null | Số tài khoản / SĐT Ví. |
| 4 | qrImage | private | URL | Ảnh mã QR thanh toán. |

  9. ***Class ContactFormBlock***

Cho phép khách truy cập gửi tin nhắn đến chủ trang.

* Kế thừa từ: Block.  
* Danh sách thuộc tính:

| Seq | Property | Modifier | Constraint | Description |
| ----- | :---- | :---- | :---- | :---- |
| 1 | *(Inherited)* | protected | \- | Các thuộc tính của Block. |
| 2 | receiveEmail | private | Email format | Email nhận thông tin liên hệ. |

* Danh sách phương thức chính :

| Seq | Operation | Modifier | Constraint | Description |
| ----- | :---- | :---- | :---- | :---- |
| 1 | submitForm(content) | public | \- | Gửi nội dung tin nhắn của khách tới email chủ trang. |


  10. ***Class AnalyticsEvent***

Dữ liệu log thô lưu trữ lịch sử tương tác.

* Kế thừa từ: Không.  
* Danh sách thuộc tính:

| Seq | Property | Modifier | Constraint | Description |
| ----- | :---- | :---- | :---- | :---- |
| 1 | eventId | private | PK, Auto Inc | Mã sự kiện. |
| 2 | pageId | private | Nullable, FK | ID trang (nếu là View). |
| 3 | blockId | private | Nullable | ID khối (nếu là Click). |
| 4 | eventType | private | Enum | Loại sự kiện (PageView, LinkClick). |
| 5 | timestamp | private | Time | Thời điểm xảy ra sự kiện. |

2. # **Data Design**

   1. ## **Data Specification**

**Bảng User**

| Khóa | Thuộc tính | Kiểu dữ liệu | Diễn giải | Ràng buộc |
| ----- | ----- | ----- | ----- | ----- |
| PK | user\_id | integer | Khóa chính, định danh duy nhất của người dùng |  Primary Key, Auto Increment |
|   | email | varchar | Địa chỉ email của người dùng | Unique, Not Null |
|   | password | varchar | Mật khẩu đăng nhập (thường lưu dưới dạng hash) | Min 8 chars |
|   | auth\_provider | varchar | Tên nhà cung cấp xác thực (ví dụ: google, email) | Not Null |
|   | full\_name | varchar | Họ và tên đầy đủ của người dùng | Max 100 chars |
|   | avatar\_url | varchar | Đường dẫn đến hình ảnh đại diện của người dùng |  |
|  | pro\_purchase | boolean | Trạng thái đã mua gói Pro hay chưa |  |

**Bảng bio\_page** 

| Khóa | Thuộc tính | Kiểu dữ liệu | Diễn giải | Ràng buộc |
| ----- | ----- | ----- | ----- | ----- |
| PK | page\_id | integer | Khóa chính, định danh duy nhất của trang bio |  Primary Key, Auto Increment |
| FK | user\_id | integer | ID của người dùng sở hữu trang này | Not Null, Khóa ngoại tham chiếu đến `users.user_id` |
|  | username | varchar | Tên định danh (URL handle) của trang bio | Unique, Not Null |
|  | bio\_description | text | Nội dung mô tả tiểu sử | Max 200 chars |
|  | is\_logo\_hidden | boolean | Cấu hình ẩn/hiện logo Zalo/nền tảng xã hội | Default: False |
|  | view\_count | integer | Tổng lượt xem trang | Default: 0 |

**Bảng Block**

| Khóa | Thuộc tính | Kiểu dữ liệu | Diễn giải | Ràng buộc |
| ----- | ----- | ----- | ----- | ----- |
| PK | block\_id | integer | Khóa chính, định danh duy nhất của block | Primary Key |
| FK | page\_id | integer | ID của trang Bio chứa block này | Not Null, Khóa ngoại tham chiếu `bio_pages.page_id` |
|  | title | varchar | Tiêu đề hiển thị của block |  |
|  | block\_type | varchar | Loại block (ví dụ: zalo, donate, social...) |  |
|  | sort\_order | integer | Thứ tự sắp xếp hiển thị trên trang |  |
|  | is\_visible | boolean | Trạng thái ẩn/hiện của block |  |

**Bảng Zalo\_blocks**

| Khóa | Thuộc tính | Kiểu dữ liệu | Diễn giải | Ràng buộc |
| ----- | ----- | ----- | ----- | ----- |
| PK, FK | block\_id | integer | Định danh block | Khóa ngoại tham chiếu `blocks.block_id` |
|  | zalo\_phone\_number | varchar | Số điện thoại Zalo để liên hệ |  |

**Bảng Donate\_blocks**

| Khóa | Thuộc tính | Kiểu dữ liệu | Diễn giải | Ràng buộc |
| ----- | ----- | ----- | ----- | ----- |
| PK, FK | block\_id | integer | Định danh block | Khóa ngoại tham chiếu `blocks.block_id` |
|  | payment\_method | varchar | Phương thức thanh toán (Bank, MoMo...) |  |
|  | payment\_identifier | varchar | Số tài khoản hoặc mã định danh thanh toán |  |
|  | qr\_image\_url | varchar | Đường dẫn ảnh mã QR thanh toán |  |

**Bảng Social\_blocks**

| Khóa | Thuộc tính | Kiểu dữ liệu | Diễn giải | Ràng buộc |
| ----- | ----- | ----- | ----- | ----- |
| PK, FK | block\_id | integer | Định danh block | Khóa ngoại tham chiếu `blocks.block_id` |
|  | url | varchar | Đường dẫn đến trang mạng xã hội |  |

**Bảng Ecommerce\_blocks**

| Khóa | Thuộc tính | Kiểu dữ liệu | Diễn giải | Ràng buộc |
| ----- | ----- | ----- | ----- | ----- |
| PK, FK | block\_id | integer | Định danh block | Khóa ngoại tham chiếu `blocks.block_id` |
|  | product\_url | varchar | Đường dẫn đến sản phẩm |  |
|  | cached\_image\_url | varchar | Đường dẫn ảnh sản phẩm (lưu cache) |  |
|  | cached\_name | varchar | Tên sản phẩm (lưu cache) |  |

**Bảng Contact\_form\_blocks**

| Khóa | Thuộc tính | Kiểu dữ liệu | Diễn giải | Ràng buộc |
| ----- | ----- | ----- | ----- | ----- |
| PK, FK | block\_id | integer | Định danh block | Khóa ngoại tham chiếu `blocks.block_id` |
|  | receive\_email | varchar | Địa chỉ email nhận thông tin liên hệ |  |

**Bảng Analytics\_events**

| Khóa | Thuộc tính | Kiểu dữ liệu | Diễn giải | Ràng buộc |
| ----- | ----- | ----- | ----- | ----- |
| PK | event\_id | integer | Khóa chính, định danh sự kiện | Primary Key,  Auto Inc |
| FK | page\_id | integer | ID của trang Bio xảy ra sự kiện | Not Null, Khóa ngoại tham chiếu `bio_pages.page_id` |
| FK | block\_id | integer | ID của block được tương tác (nếu có) | Not Null, Khóa ngoại tham chiếu `blocks.block_id` |
|  | event\_type | varchar | Loại sự kiện (ví dụ: 'view', 'click') |  |
|  | timestamp | time | Thời gian xảy ra sự kiện |  |

**Bảng Custom\_domains**

| Khóa | Thuộc tính | Kiểu dữ liệu | Diễn giải | Ràng buộc |
| ----- | ----- | ----- | ----- | ----- |
| PK | domain\_name | varchar | Tên miền tùy chỉnh (ví dụ: mysite.com) | Primary Key, Unique |
| FK | page\_id | integer | ID của trang Bio được gán tên miền này | Khóa ngoại tham chiếu `bio_pages.page_id` |
|  | Status | varchar | Trạng thái xác thực tên miền (ví dụ: 'pending', 'active') |  |
|  | cname\_target | varchar | Đích CNAME mà tên miền cần trỏ về |  |

**Bảng Theme\_libraries**

| Khóa | Thuộc tính | Kiểu dữ liệu | Diễn giải | Ràng buộc |
| ----- | ----- | ----- | ----- | ----- |
| PK | theme\_id | integer | Khóa chính, định danh của mẫu giao diện | Primary Key, Unique |
|  | background\_value | varchar | Giá trị nền (mã màu hex, gradient hoặc URL hình ảnh) |  |
|  | background\_type | varchar | Loại nền (ví dụ: 'solid', 'gradient', 'image') |  |
|  | font\_family | varchar | Tên phông chữ sử dụng cho theme |  |
|  | text\_color | varchar | Mã màu của văn bản chính |  |
|  | button\_color | varchar | Mã màu nền của các nút bấm |  |
|  | button\_style | varchar | Kiểu dáng nút bấm (ví dụ: 'rounded', 'square', 'outline') |  |

**Bảng Theme\_configs**

| Khóa | Thuộc tính | Kiểu dữ liệu | Diễn giải | Ràng buộc |
| ----- | ----- | ----- | ----- | ----- |
| PK, FK | page\_id | integer | Khóa chính, ID của trang Bio cần cấu hình | Primary Key, Khóa ngoại tham chiếu `bio_pages.page_id` |
|  | background\_value | varchar | Giá trị nền tùy chỉnh (nếu có) |  |
|  | background\_type | varchar | Loại nền tùy chỉnh |  |
|  | font\_family | varchar | Tên phông chữ sử dụng cho theme |  |
|  | text\_color | varchar | Mã màu của văn bản chính |  |
|  | button\_color | varchar | Mã màu nền của các nút bấm |  |
|  | button\_style | varchar | Kiểu dáng nút bấm (ví dụ: 'rounded', 'square', 'outline') |  |

3. # **User Interface and User Experience Design**

| Seq | Screen | Description |
| :---- | :---- | :---- |
| 1 | Login screen | Màn hình đăng nhập |
| 2 | Registration screen | Màn hình đăng ký |
| 3 | Login google popup | Màn hình đăng nhập khi mà chọn phương thức đăng nhập bằng google |
| 4 | Reset password screen | Màn hình “quên mật khẩu” và sẽ reset lại mật khẩu |
| 5 | Create a bio page screen | Màn hình tạo trang bio mới |
| 6 | Manage a bio page screen | Màn hình quản lý 1 trang bio |
| 7 | Manage bio pages popup | Popup các trang bio của tài khoản. |
| 8 | Appearance screen | Màn hình chỉnh sửa giao diện |
| 9 | Templates libary screen | Màn hình thư viện template mẫu cho phép người dùng có thể sử dụng nhanh. |
| 10 | Add block popup | Popup thêm các block vào trang bio |
| 11 | Setting screen | Màn hình cài đặt tài khoản |
| 12 | AI writer popup  | Popup sử dụng AI để rewrite bio |
| 13 | Analytics screen | Màn hình để xem những thống kê, phân tích lượt xem của 1 trang bio. |
| 14 | QR popup | Popup hiển thị mã QR, link để chia sẻ trang bio |
| 15 | Add chat popup | Popup điền thông tin chi tiết khi thêm “chat” vào trang bio |
| 16 | Add donate popup | Popup điền thông tin chi tiết khi thêm “donate” vào trang bio |
| 17 | Add social popup | Popup điền thông tin chi tiết khi thêm “social” vào trang bio |
| 18 | Add product popup | Popup điền thông tin chi tiết khi thêm “product” vào trang bio |
| 19 | Add contact popup | Popup điền thông tin chi tiết khi thêm “contact” vào trang bio |
| 20 | Domain setting screen | Màn hình tuỳ chỉnh domain cho trang bio. |
| 21 | Pricing screen | Trang hiện thị thông tin các hạng account. |

   ### 