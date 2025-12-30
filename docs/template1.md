

1. # **Problem Statement**

Trong những năm gần đây, Việt Nam đã chứng kiến sự bùng nổ mạnh mẽ của nền kinh tế số, được thúc đẩy bởi nền kinh tế sáng tạo (creator economy) cùng với sự phát triển nhanh chóng của thương mại xã hội (social commerce). Các nhà sáng tạo nội dung, người ảnh hưởng (influencer), doanh nghiệp nhỏ và vừa (SME) cũng như các thương hiệu ngày càng phụ thuộc vào các nền tảng mạng xã hội như TikTok, Instagram và Facebook để tương tác với khán giả và thúc đẩy hoạt động kinh doanh.

Tuy nhiên, một hạn chế lớn của các nền tảng này là việc chỉ cho phép chèn một đường dẫn (link) duy nhất trong phần “link in bio”, buộc người dùng phải thường xuyên thay đổi liên kết để phù hợp với từng chiến dịch hoặc nội dung. Điều này dẫn đến sự rời rạc và thiếu hiệu quả trong hành trình trải nghiệm của người theo dõi.

Từ hạn chế đó, các công cụ “link-in-bio” đã ra đời, cho phép người dùng tạo một trang đích (landing page) duy nhất chứa nhiều liên kết khác nhau. Mặc dù các sản phẩm quốc tế như Linktree và Beacons đã đạt được độ phổ biến nhất định, song chúng vẫn bộc lộ nhiều hạn chế khi áp dụng vào thị trường Việt Nam. Các giải pháp này thường thiếu yếu tố bản địa hóa sâu (localization) về ngôn ngữ, giao diện người dùng, cũng như khả năng tích hợp với các cổng thanh toán và nền tảng thương mại điện tử nội địa. Bên cạnh đó, mô hình giá và tính năng của các công cụ này chưa thực sự phù hợp với nhu cầu và chiến lược kiếm tiền của người sáng tạo nội dung và doanh nghiệp Việt Nam.

Từ thực tế đó, một cơ hội thị trường rõ ràng đã xuất hiện cho việc phát triển một nền tảng “link-in-bio” được bản địa hóa hoàn toàn, hướng đến người dùng Việt Nam. Vấn đề không chỉ dừng lại ở việc tổng hợp các liên kết, mà còn nằm ở việc xây dựng một nền tảng tích hợp, trực quan và mạnh mẽ, đóng vai trò như trung tâm quản lý toàn bộ sự hiện diện trực tuyến của cá nhân hoặc doanh nghiệp.

Giải pháp được đề xuất hướng tới việc trao quyền cho người dùng trong việc chia sẻ nội dung, xây dựng thương hiệu cá nhân, tương tác với khán giả, và tận dụng hiệu quả sức ảnh hưởng để kiếm tiền trong hệ sinh thái số Việt Nam. Dự án nhằm mục tiêu phát triển một nền tảng “link-in-bio” thông minh, hiện đại và mang tính bản địa cao, qua đó thu hẹp khoảng cách giữa các sản phẩm quốc tế mang tính đại trà và các công cụ trong nước còn hạn chế.

2. # **Requirements Overview**

   1. ## ***Stakeholders***

| STT | Stakeholder |  | Mô tả |
| :---: | ----- | :---- | ----- |
| 1 | Chủ dự án |  | Cung cấp nguồn lực tài chính, định hướng chiến lược và giám sát tổng thể tiến trình của dự án. |
| 2 | Supervisor (thầy Đinh Bá Tiến, thầy Ngô Ngọc Đăng Khoa) |  | Cố vấn về mặt kỹ thuật, phương pháp luận và quy trình phát triển phần mềm. Đánh giá kết quả và chất lượng học thuật của dự án |
| 3 | Nhóm phát triển phần mềm | Project manager | Chịu trách nhiệm điều phối công việc, quản lý tiến độ, và giải quyết các trở ngại phát sinh để đảm bảo dự án vận hành trôi chảy và đạt mục tiêu đề ra. |
| 4 |  | Business analyst | Nghiên cứu thị trường và phân tích nhu cầu của người dùng mục tiêu. Chuyển hóa các yêu cầu kinh doanh thành các đặc tả kỹ thuật chi tiết cho đội ngũ phát triển. |
| 5 |  | Designer | Kiến tạo trải nghiệm người dùng thông qua việc thiết kế giao diện trực quan, thân thiện và nhất quán, giúp người dùng dễ dàng tương tác và đạt được mục tiêu của họ. |
| 6 |  | Developer | Trực tiếp xây dựng các tính năng của sản phẩm bằng cách viết, kiểm thử, và bảo trì mã nguồn theo thiết kế đã được phê duyệt. |
| 7 |  | Tester | Thiết kế và thực thi các kịch bản kiểm thử (chức năng, hiệu năng, bảo mật) nhằm phát hiện lỗi và đảm bảo sản phẩm VieLink đạt tiêu chuẩn chất lượng trước khi ra mắt. |
| 8 | 	 Nhóm vận hành và bảo trì phần mềm |  | Đảm bảo hệ thống VieLink hoạt động ổn định sau khi triển khai, hỗ trợ người dùng và thực hiện các cập nhật, vá lỗi cần thiết. |
|  | USER |  | Đây là nhóm đối tượng chính trực tiếp sử dụng phần mềm. Họ là những cá nhân, tổ chức cần một trang đích duy nhất để quản lý sự hiện diện trực tuyến của mình: Nhóm này bao gồm: Người sáng tạo nội dung / Influencer / Affiliate Marketer**:** Sử dụng nền tảng để tổng hợp liên kết, xây dựng thương hiệu cá nhân, tương tác với khán giả và kiếm tiền (ví dụ: affiliate, nhận quyên góp) Doanh nghiệp (SME) / Thương hiệu / Người bán hàng: Sử dụng trang bio link để giới thiệu sản phẩm, tích hợp TMĐT (Shopee, Lazada), tăng nhận diện thương hiệu, và cung cấp kênh liên hệ (Zalo, Contact Form) Người dùng chuyên nghiệp / Freelancer: Cần một trang chuyên nghiệp, có thể tùy chỉnh tên miền riêng và gỡ bỏ thương hiệu nền tảng để tăng độ tin cậy |

### 

   2. ## ***Functional Requirements Specification***

| *Nhóm * | *Chức năng* | *Chi tiết* |
| ----- | ----- | :---- |
|  **Nhóm chức năng quản lý tài khoản** | Đăng ký | Hệ thống cung cấp hai (02) phương thức đăng ký: 1\. Đăng ký qua Email/Mật khẩu: Yêu cầu thông tin bắt buộc: Email, Mật khẩu, Xác nhận Mật khẩu. Kiểm tra tính hợp lệ (validation) email: Định dạng đúng (`@`, `.com`, v.v.) và chưa tồn tại trong cơ sở dữ liệu (CSDL). Kiểm tra tính hợp lệ mật khẩu: Tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, và số. Mật khẩu và Xác nhận Mật khẩu phải trùng khớp. Hiển thị thông báo lỗi cụ thể nếu thông tin không hợp lệ (ví dụ: "Email đã tồn tại", "Mật khẩu không khớp"). 2\. Đăng ký qua OAuth (Google): Người dùng chọn đăng ký bằng Google. Hệ thống chuyển hướng đến trang xác thực của Google. Nếu xác thực thành công, hệ thống nhận thông tin (Email, Tên, Ảnh đại diện) và tự động tạo tài khoản nếu email đó chưa tồn tại. |
|  | Đăng nhập và khôi phục | Người dùng đăng nhập bằng email và mật khẩu đã đăng ký. Hỗ trợ đăng nhập thông qua các tài khoản mạng xã hội (Google). Cung cấp chức năng "Quên mật khẩu", cho phép người dùng đặt lại mật khẩu qua email. |
|  | Chỉnh sửa profile người dùng | Người dùng đã đăng nhập có thể: Cập nhật Tên hiển thị: Thay đổi tên sẽ hiển thị trên trang bio. Cập nhật Ảnh đại diện: Cho phép tải lên (upload) ảnh mới (ví dụ: .JPG, .PNG, tối đa 2MB), hỗ trợ cắt (crop) ảnh cơ bản. Thay đổi Mật khẩu: Yêu cầu nhập: Mật khẩu cũ, Mật khẩu mới, Xác nhận Mật khẩu mới. Hệ thống phải xác thực mật khẩu cũ trước khi cho phép thay đổi. Giao diện lưu lại thay đổi và phản hồi trạng thái thành công hoặc lỗi nếu xảy ra vấn đề trong quá trình cập nhật. |
| **Nhóm chức năng Xây dựng Trang Bio** | Tạo trang bio link cá nhân | Ngay sau khi đăng ký thành công (lần đầu), hệ thống sẽ yêu cầu người dùng tạo trang bio đầu tiên. Người dùng phải nhập một "username" (tên người dùng) mong muốn (ví dụ: `nguyenvana`). Hệ thống kiểm tra "username" real-time, đảm bảo tính duy nhất (chưa ai sử dụng), không chứa ký tự đặc biệt, không vi phạm chính sách. Sau khi xác nhận, hệ thống tạo một URL công khai duy nhất cho người dùng (ví dụ: [`vielink.vn/nguyenvana`](http://vielink.vn/nguyenvana)). |
|  | Quản lí các trang bio cá nhân | Có thể tạo nhiều thêm username mới, mỗi username là một đường dẫn riêng, và có các giao diện riêng (một người có thể có nhiều acc bio cá nhân khác nhau) Có thể đổi qua lại giữa các link bio thông qua ấn vào logo, lúc này hiện lên danh sách username và ấn sang username khác Khi ấn vào logo, có thêm 1 nút tạo link bio mới, khi ấn vào mới người dùng nhập username (kiểm tra realtime xem có tồn tài chưa) và giúp người dụng tạo 1 url mới tương ứng |
|  | Giao diện | Trong Bảng điều khiển, tab "Giao diện" (Appearance) cho phép tùy chỉnh sâu: **Nền (Background):** Cho phép chọn màu đơn sắc (qua color picker), màu gradient, hoặc tải lên ảnh nền riêng. **Nút (Buttons):** Cho phép tùy chỉnh kiểu dáng nút (bo góc, vuông), màu sắc nút, màu chữ trên nút. **Phông chữ (Fonts):** Cho phép chọn phông chữ (từ danh sách Google Fonts) cho tiêu đề và nội dung. **Màu chữ (Text Colors):** Cho phép tùy chỉnh màu sắc cho các thành phần văn bản, bao gồm màu của mô tả (description color) và màu của tên người dùng (@username color). |
|  | Quản lý Khối Mạng Xã hội (Social media Blocks) | **Tạo khối (Create):** Hệ thống cho phép người dùng thêm các khối liên kết mới chứa các link của social  media. Người dùng nhấn vào nút "Thêm Social Media" (ví dụ: biểu tượng dấu cộng) để tạo một khối mới. **Cấu hình khối:** Mỗi khối mới yêu cầu thông tin: **Tiêu đề** (văn bản sẽ hiển thị trên nút) và **URL** (đường dẫn mà người xem sẽ được chuyển đến). **Cập nhật khối (Update):** Người dùng có thể nhấp vào một khối đã tạo bất kỳ lúc nào để chỉnh sửa (update) lại Tiêu đề hoặc URL. **Xóa khối (Delete):** Mỗi khối phải có một tùy chọn (ví dụ: biểu tượng thùng rác hoặc nút "Xóa") để cho phép người dùng xóa khối đó khỏi trang bio. **Sắp xếp thứ tự (Reorder):** Cho phép người dùng nhấn giữ biểu tượng (ví dụ: 6 chấm) và kéo-thả (drag-and-drop) để thay đổi thứ tự hiển thị của các khối liên kết. Thứ tự mới phải được lưu tự động . **Bật/Tắt (Toggle):** Cung cấp một nút bật/tắt (toggle) "Hiển thị" cho mỗi khối liên kết. Khi ở trạng thái "Ẩn", khối đó không xuất hiện trên trang bio công khai nhưng vẫn còn trong Bảng điều khiển. **Không giới hạn:** Hệ thống (về mặt kỹ thuật CSDL) không được giới hạn số lượng liên kết mà một người dùng có thể tạo. |
|  | Thư viện mẫu | Trong tab giao diện, cho phép lựa chọn các template có sẵn trong mục “Template có sẵn” Cung cấp một thư viện các mẫu (template) giao diện có sẵn và đa dạng được bản địa hóa cho thị trường Việt Nam Người dùng có thể xem trước (preview) các mẫu. |
|  | Gỡ bỏ logo | Đây là tính năng trả phí (Gói Pro) cho phép người dùng chuyên nghiệp gỡ bỏ logo của VieLink (nền tảng) khỏi trang của mình Giúp tăng tính chuyên nghiệp cho trang bio  Trong "Cài đặt", người dùng Pro sẽ thấy một nút bật/tắt (toggle) "Hiển thị logo VieLink". Khi TẮT, dòng chữ/logo "Powered by VieLink" (hoặc tương tự) ở chân trang bio công khai sẽ bị ẩn. |
|  | AI writer | Cung cấp Trợ lý AI (AI Bio Writer). Hỗ trợ người dùng (người không có kỹ năng viết lách) tạo hoặc cải thiện/tối ưu hóa phần mô tả cá nhân. Khi người dùng nhấn nút "AI writer", hệ thống sẽ gửi nội dung "Mô tả cá nhân" (Bio Description) hiện tại qua AI để viết lại. Hệ thống hiển thị kết quả do AI viết lại, cho phép người dùng chọn "Accept" (Chấp nhận) để áp dụng hoặc "Cancel" (Hủy) để giữ nguyên nội dung cũ. |
|  | Preview live | Giao diện Bảng điều khiển (khi chỉnh sửa trang bio) phải được chia làm 2 cột (trên desktop). **Cột trái:** Khu vực cấu hình (thêm link, đổi màu, nhập chữ...). **Cột phải:** Khung mô phỏng điện thoại, hiển thị trang bio công khai. Mọi thay đổi ở cột trái (kể cả gõ từng ký tự) phải được phản ánh (render) ngay lập tức ở cột phải, mà không cần tải lại trang. |
|  | Responsive | Trang bio công khai (giao diện cho khách truy cập) phải được thiết kế responsive. Bố cục phải tự động co giãn và sắp xếp lại (ví dụ: kích thước font, kích thước nút) để hiển thị tối ưu trên mọi kích cỡ màn hình, từ điện thoại (375px) đến máy tính bảng và desktop. |
|  **Nhóm chức năng Quản lý Nội dung** | TMĐT | Cung cấp khối liên kết dành riêng cho các nền tảng Thương mại điện tử (Shopee, Lazada) Khi người dùng (affiliate marketer) thêm link sản phẩm, hệ thống tự động hiển thị hình ảnh và tên sản phẩm. Giúp thu hút người xem và tăng hiệu quả chuyển đổi Hệ thống nhận dạng được link shoppee hoặc lazada dựa trên domain. Hệ thống tự động trích xuất thông tin sản phẩm HIển thị khối thông tin sản phẩm ở dạng trực quan Lưu cache dữ liệu sản phẩm để tăng tốc hiển thị giảm số lần truy cập API. |
|  | Donate | Cung cấp một loại khối "Ủng hộ" (Donate/Tips). Người dùng chọn loại (Momo, ZaloPay, VietQR...) và nhập thông tin (SĐT, link nhận tiền, hoặc tải lên ảnh QR). Hiển thị một nút (ví dụ: "Ủng hộ tôi qua Momo") trên trang bio. Khi khách nhấn vào, hiển thị pop-up chứa ảnh QR hoặc chuyển hướng đến ứng dụng thanh toán (nếu trên di động). |
|  | Khối biểu mẫu liên hệ | Cung cấp một loại khối "Biểu mẫu liên hệ". Hiển thị các trường: Họ tên, Email (bắt buộc), Nội dung tin nhắn (bắt buộc). Phải kiểm tra định dạng email và các trường bắt buộc không được trống. Khi khách nhấn "Gửi", hệ thống gửi nội dung biểu mẫu đến email đã đăng ký của chủ trang bio. Hiển thị thông báo "Gửi thành công" cho khách. |
|  | Tích hợp nút chat Zalo  | Cung cấp một loại khối "Liên hệ nhanh" (Quick Contact). Người dùng chọn "Zalo" và nhập số điện thoại đã đăng ký Zalo. Hiển thị một nút (ví dụ: "Chat với tôi qua Zalo"). Khi khách truy cập nhấn vào, hệ thống thực hiện hành động mở URI `zalo.me/{số_điện_thoại}`. |
|  **Nhóm chức năng Phân tích & Hỗ trợ** | Bảng phân tích cơ bản | Cung cấp một tab "Phân tích" (Analytics) trong Bảng điều khiển. Hệ thống phải ghi lại (log) mỗi lượt xem trang (Page View) và mỗi lượt nhấp vào liên kết (Link Click). Hiển thị các chỉ số tổng quan (ví dụ: Tổng lượt xem, Tổng lượt nhấp) và danh sách chi tiết các liên kết kèm theo số lượt nhấp của từng link. Hỗ trợ lọc theo thời gian (7 ngày, 30 ngày). |
|  | Phân tích nguồn truy cập  | Cung cấp chức năng phân tích nguồn truy cập (Traffic Source). Giúp người kinh doanh biết lưu lượng truy cập đến từ nền tảng nào (ví dụ: Facebook, Tik Tok, Zalo). Hỗ trợ tối ưu hóa các chiến dịch quảng cáo. Dữ liệu cá nhân (nếu có) phải được ẩn danh và tuân thủ quy định bảo mật. Khi chọn mốc thời gian, dashboard cập nhật đúng dữ liệu tương ứng. |
|  | Chia sẻ QR | Trong Bảng điều khiển (khu vực "Chia sẻ"), hệ thống phải: Tự động tạo (render) một mã QR code. Dữ liệu của mã QR là URL công khai của trang bio (ví dụ: [`https://vielink.vn/username`](https://vielink.vn/username)). Cho phép người dùng "Tải xuống" mã QR (dưới dạng tệp .PNG) để sử dụng. |
|  | Tên miền tuỳ chỉnh | Đây là tính năng trả phí (Gói Pro). Trong "Cài đặt", cung cấp mục "Tên miền tùy chỉnh". Người dùng nhập tên miền của họ (ví dụ: [`mybrand.vn`](http://mybrand.vn)). Hệ thống hiển thị hướng dẫn: "Vui lòng trỏ bản ghi CNAME của `mybrand.vn` về [`cname.vielink.vn`](http://cname.vielink.vn)." Sau khi người dùng cấu hình, họ nhấn "Xác thực". Hệ thống (server) kiểm tra bản ghi DNS. Nếu thành công, trang bio của họ sẽ được truy cập qua `mybrand.vn`. |

   3. ## ***Non-Functional Requirements Specification***

Các yêu cầu phi chức năng mô tả các tiêu chí về chất lượng, hiệu suất và ràng buộc của hệ thống:

* **Bảo mật và Quyền riêng tư:**  
  * Toàn bộ giao tiếp giữa Client và Server phải sử dụng giao thức HTTPS.  
  * Mật khẩu người dùng phải được mã hóa (hashed) trước khi lưu trữ trong cơ sở dữ liệu.  
  * Hệ thống sử dụng cơ chế xác thực dựa trên JWT (JWT-based authentication) để bảo vệ các API.  
  * Cần có cơ chế giới hạn tỷ lệ truy cập (API rate limiting) cơ bản để kiểm soát lưu lượng và chống spam.  
* **Hiệu năng và Tốc độ:**  
  * Thời gian tải trang bio link công khai phải nhanh, tối ưu cho các thiết bị di động có kết nối mạng chưa ổn định.  
  * Hệ thống cơ sở dữ liệu (MongoDB) phải đảm bảo khả năng truy xuất dữ liệu hiệu quả, ngay cả khi lượng liên kết và dữ liệu phân tích tăng cao.  
  * Bảng điều khiển phân tích phải phản ánh dữ liệu (lượt xem, nhấp chuột) gần thời gian thực.  
* **Tính khả dụng và Giao diện (Usability):**  
  * Hệ thống phải là một ứng dụng web-based hoàn toàn, người dùng cuối không cần cài đặt bất kỳ phần mềm nào.  
  * Giao diện quản trị (admin dashboard) phải trực quan, dễ sử dụng, đặc biệt là các thao tác kéo-thả.  
  * Hệ thống phải đảm bảo thiết kế responsive, hiển thị tối ưu trên mọi kích thước màn hình.  
* **Khả năng tương thích (Compatibility):**  
  * Ứng dụng Client phải hoạt động ổn định trên các trình duyệt web hiện đại phổ biến như Google Chrome, Mozilla Firefox, Safari, và Microsoft Edge.  
  * Hỗ trợ truy cập từ nhiều hệ điều hành khác nhau (Windows, macOS, Linux, Android, iOS).  
* **Khả năng mở rộng và Bảo trì (Scalability & Maintainability):**  
  * Kiến trúc hệ thống được xây dựng theo mô hình Client-Server và (ngụ ý) các dịch vụ ứng dụng (Application Services).  
  * Kiến trúc phải đảm bảo tính mở rộng, cho phép dễ dàng tích hợp các khối nội dung hoặc dịch vụ bên thứ ba mới trong tương lai.  
  * Hệ thống phải dễ bảo trì.

# 

3. # **Requirements Analysis**

   1. ## ***Use Case Specification***

      1. ### **Use Case 1**

| *Use case ID* | U001 |
| :---- | :---- |
| *Use Case*  | Đăng ký tài khoản |
| *Brief Description* | Là người dùng mới, tôi muốn tạo một tài khoản để có thể quản lý trang bio link cá nhân của mình trên hệ thống VieLink. |
| *Actor* | Người dùng mới. |
| *Pre-Condition* | Người dùng đang sử dụng thiết bị có kết nối Internet. |
| *Result* | Hệ thống tạo thành công tài khoản mới và lưu vào cơ sở dữ liệu. Người dùng được tự động đăng nhập và chuyển hướng đến trang để tạo bio link lần đầu tiên |
| *Main Scenarios* | Đăng kí bằng email và mật khẩu Người dùng truy cập trang chủ và nhấn vào nút "Đăng ký" Hệ thống hiển thị form đăng ký Người dùng nhập Email hợp lệ (chưa tồn tại tài khoản), Mật khẩu (đáp ứng tiêu chí) và Xác nhận Mật khẩu (trùng khớp) Người dùng nhấn nút "Đăng ký" Hệ thống kiểm tra thông tin hợp lệ và gửi mail xác nhận tới địa chỉ email đã nhập Hệ thống kiểm tra mail xác nhận, tạo tài khoản mới trong CSDL, mã hóa mật khẩu Hệ thống tự động đăng nhập cho người dùng và chuyển hướng đến trang "Tạo trang bio" Đăng kí bằng OAuth Người dùng truy cập trang chủ và nhấn vào icon Google Hệ thống chuyển hướng người dùng đến trang xác thực của nhà cung cấp dịch vụ Người dùng đăng nhập và cấp quyền thành công trên trang của nhà cung cấp Hệ thống tạo tài khoản mới với thông tin nhận được. Hệ thống tự động đăng nhập cho người dùng và chuyển hướng đến trang "Tạo trang bio".  |
| *Alternatice Scenarios* | 1.3.a Thông tin đăng ký không hợp lệ Nếu Email không đúng định dạng, hệ thống hiển thị thông báo lỗi: "Định dạng email không hợp lệ" Nếu mật khẩu không đủ mạnh (thiếu 8 ký tự, chữ hoa, chữ thường, số), hệ thống hiển thị thông báo lỗi tương ứng Nếu "Xác nhận Mật khẩu" không khớp, hệ thống hiển thị thông báo: "Mật khẩu không khớp" 1.5.a Email đăng ký đã tồn tại  Hệ thống hiển thị thông báo lỗi: "Email này đã được sử dụng". Người dùng cần sử dụng email khác hoặc chọn đăng nhập 1.6.a Sau 10 phút nếu không xác nhận mail, hệ thống không lưu thông tin người dùng. |
| *Non-Functional Constraints* | Tất cả các trường thông tin bắt buộc phải được điền đầy đủ, không được để trống. Tên đăng nhập phải là duy nhất, chỉ bao gồm chữ cái (hoa hoặc thường) và chữ số, không chứa ký tự đặc biệt. Mật khẩu cần có tối thiểu 8 ký tự, trong đó phải có ít nhất một chữ hoa, một chữ thường và một chữ số. Mỗi trường thông tin không được vượt quá 50 ký tự. Mật khẩu phải được mã hóa trước khi lưu vào cơ sở dữ liệu. Ô nhập mật khẩu và xác nhận mật khẩu cần có chức năng bật/tắt hiển thị mật khẩu, mặc định ở chế độ ẩn. |

      2. ### **Use Case 2**

| *Use case ID* | U002 |
| :---- | :---- |
| *Use Case*  | Đăng nhập tài khoản |
| *Brief Description* | Là người dùng đã có tài khoản, tôi muốn đăng nhập vào hệ thống để truy cập và quản lý trang bio link của mình. |
| *Actor* | Người dùng đã đăng ký. |
| *Pre-Condition* | Người dùng đang sử dụng thiết bị có kết nối Internet. Người dùng chưa đăng nhập vào hệ thống. Người dùng đã có tài khoản hợp lệ trong hệ thống |
| *Result* | Người dùng được xác thực thành công. Hệ thống chuyển hướng người dùng đến trang Bảng điều khiển (Dashboard) quản lý bio link. |
| *Main Scenarios* | Đăng nhập bằng email và mật khẩu Người dùng truy cập trang Đăng nhập Người dùng nhập chính xác Email và Mật khẩu đã đăng ký. Người dùng nhấn nút "Đăng nhập" Hệ thống xác thực thông tin đăng nhập với dữ liệu trong CSDL Hệ thống tạo một session cho người dùng Hệ thống chuyển hướng người dùng đến trang Dashboard  Đăng nhập bằng OAuth Người dùng truy cập trang chủ và nhấn vào icon Google Hệ thống chuyển hướng người dùng đến trang xác thực của nhà cung cấp dịch vụ Người dùng đăng nhập và cấp quyền thành công trên trang của nhà cung cấp Hệ thống nhận thông tin, tìm tài khoản tương ứng với Email trong CSDL. Tìm thấy tài khoản, hệ thống tạo phiên làm việc và chuyển hướng người dùng đến trang Dashboard  |
| *Alternatice Scenarios* | 3.2.a Thông tin đăng nhập không chính xác Hệ thống hiển thị thông báo lỗi: "Email hoặc mật khẩu không đúng". Người dùng ở lại trang đăng nhập để thử lại. 3.2.b Người dùng nhấn quên mật khẩu Hệ thống chuyển hướng người dùng đến quy trình Khôi phục mật khẩu 4.4.a Người dùng không tồn tại  Nếu Email từ nhà cung cấp chưa được đăng ký, hệ thống sẽ tự động tạo tài khoản mới và đăng nhập cho người dùng |
| *Non-Functional Constraints* | Tất cả các trường thông tin bắt buộc phải được điền đầy đủ, không được để trống Mỗi trường thông tin không được vượt quá 50 ký tự. Ô nhập mật khẩu cần có chức năng bật/tắt hiển thị mật khẩu, mặc định ở chế độ ẩn. Giới hạn số lần nhập mật khẩu là 5 lần  |

      3. ### **Use Case 3**

| *Use case ID* | U003 |
| :---- | :---- |
| *Use Case*  | Khôi phục mật khẩu |
| *Brief Description* | Tôi đã quên mật khẩu của mình và cần một cách an toàn để đặt lại mật khẩu mới, nhằm lấy lại quyền truy cập vào tài khoản. |
| *Actor* | Người dùng đã đăng ký. |
| *Pre-Condition* | Người dùng đang sử dụng thiết bị có kết nối Internet. Người dùng chưa đăng nhập vào hệ thống. Người dùng đã có tài khoản hợp lệ trong hệ thống Người dùng quên mật khẩu  |
| *Result* | Mật khẩu của người dùng được cập nhật thành công trong hệ thống. |
| *Main Scenario* | Từ trang Đăng nhập, người dùng nhấn vào liên kết "Quên mật khẩu" Hệ thống hiển thị trang yêu cầu người dùng nhập email đã đăng ký Người dùng nhập email của mình và hoàn thành captcha Hệ thống kiểm tra email hợp lệ, gửi email xác thực Người dùng mở email và nhấp vào liên kết được cung cấp. Hệ thống xác thực liên kết và chuyển hướng người dùng đến trang tạo mật khẩu mới. Người dùng nhập Mật khẩu mới và Xác nhận Mật khẩu mới. Hệ thống cập nhật mật khẩu mới (đã mã hóa) vào CSDL và vô hiệu hóa liên kết đã sử dụng. Hệ thống hiển thị thông báo "Đặt lại mật khẩu thành công" và chuyển hướng người dùng về trang Đăng nhập. |
| *Alternatice Scenarios* | 3.a. Người dùng không hoàn thành captcha Thông báo "Captcha không đúng” và tạo captcha mới, yêu cầu người dùng đánh lại. 4.a Email không tồn tại / không hợp lệ Hệ thống thông báo email không hợp lệ / tồn tại và làm mới ô nhập. 6.a Nếu mail xác thực không kích hoạt trong 10 phút Hệ thống hủy bỏ liên kết yêu cầu đổi mật khẩu 8.a Mật khẩu mới không hợp lệ. Hệ thống thông báo mật khẩu không hợp lệ, yêu cầu nhập lại |
| *Non-Functional Constraints* | Hiệu năng: đảm bảo thời gian gửi email xác thực là nhanh chóng Captcha load lên nhanh. |

      4. ### **Use Case 4**

| *Use case ID* | U004 |
| :---- | :---- |
| *Use Case*  | Chỉnh sửa thông tin cá nhân  |
| *Brief Description* | Sau khi đăng nhập, tôi muốn cập nhật thông tin tài khoản của mình, bao gồm tên hiển thị, ảnh đại diện, và thay đổi mật khẩu  |
| *Actor* | Người dùng đã đăng nhập. |
| *Pre-Condition* | Người dùng đang sử dụng thiết bị có kết nối Internet. Người dùng đã đăng nhập |
| *Result* | Thông tin của người dùng trong CSDL được cập nhật theo thay đổi Giao diện phản ánh thông tin cập nhật |
| *Main Scenario* | Cập nhật tên và ảnh đại diện Người dùng truy cập vào tài khoản. Người dùng nhấn vào hình đại diện. Người dùng nhấn nút "Tải lên ảnh mới", chọn một tệp ảnh từ thiết bị của mình (tối đa 2 MB) Hệ thống hỗ trợ người dùng cắt (crop) ảnh Hệ thống lưu thông tin mới và hiển thị thông báo "Cập nhật thành công”. Thay đổi mật khẩu Người dùng truy cập vào "setting”. người dùng nhập Mật khẩu cũ, Mật khẩu mới, và Xác nhận Mật khẩu mới Hệ thống xác thực Mật khẩu cũ và mật khẩu mới hợp lệ  Hệ thống cập nhật mật khẩu mới vào csdl |
| *Alternatice Scenarios* | 1.3.a. Ảnh không hợp lệ Hệ thống hiển thị lỗi "Định dạng tệp không được hỗ trợ" hoặc "Kích thước tệp quá 2MB) 2.3.a. Mật khẩu cũ / mới không hợp lệ Hệ thống thông báo "Mật khẩu cũ không đúng” và làm mới ô nhập liệu Hệ thống thông báo Mật khẩu mới không hợp lệ |
| *Non-Functional Constraints* | Phải xác thực mật khẩu cũ trước khi cập nhật mật khẩu mới. Phải nén hoặc giảm độ phân giải ảnh upload từ người dùng.  |

      5. ### **Use Case 5**

| *Use case ID* | U005 |
| :---- | :---- |
| *Use Case*  | Tạo trang bio link cá nhân |
| *Brief Description* | Là người dùng mới, tôi muốn tạo trang bio link đầu tiên của mình ngay sau khi đăng ký để có một URL công khai. |
| *Actor* | Người dùng (User) |
| *Pre-Condition* | Người dùng đang đăng nhập vào hệ thống. Đây là lần đầu tiên người dùng truy cập vào bảng điều khiển (dashboard). |
| *Result* | Hệ thống tạo và lưu một trang bio mới liên kết với tài khoản người dùng. Người dùng nhận được một URL công khai duy nhất (ví dụ: vielink.vn/username). Người dùng được chuyển hướng đến Bảng điều khiển (Dashboard) chính để bắt đầu thêm liên kết và tùy chỉnh. |
| *Main Scenario* | Ngay sau khi đăng ký thành công, hệ thống hiển thị giao diện yêu cầu người dùng tạo trang bio đầu tiên. Người dùng nhập "username" (tên người dùng) mong muốn vào ô nhập liệu. Hệ thống kiểm tra "username" theo thời gian thực (real-time). Hệ thống xác nhận "username" hợp lệ và duy nhất (chưa ai sử dụng). Người dùng nhấn nút "Xác nhận" (hoặc "Tạo trang"). Hệ thống tạo trang bio với URL công khai duy nhất (vielink.vn/username) và lưu vào CSDL. Hệ thống chuyển hướng người dùng đến Bảng điều khiển chính. |
| *Alternatice Scenarios* | 3a. Username không hợp lệ (chứa ký tự đặc biệt, vi phạm chính sách): Hệ thống hiển thị thông báo lỗi ngay bên dưới ô nhập, yêu cầu người dùng nhập lại (ví dụ: "Tên người dùng không được chứa ký tự đặc biệt").  Kịch bản quay lại Bước 2\. 3b. Username đã tồn tại (không duy nhất): Hệ thống hiển thị thông báo lỗi (ví dụ: "Username này đã có người sử dụng"). Kịch bản quay lại Bước 2\. |
| *Non-Functional Constraints* | **Hiệu năng:** Thời gian kiểm tra "username" real-time phải phản hồi dưới 1 giây. **Tính khả dụng:** Thông báo lỗi phải rõ ràng, cụ thể và hiển thị ngay lập tức. |

### 

      6. ### **Use Case 6**

| *Use case ID* | U006 |
| :---- | :---- |
| *Use Case*  | Quản lí các trang bio cá nhân |
| *Brief Description* | Là Người dùng, tôi muốn quản lý, chuyển đổi qua lại, và tạo thêm các trang bio link cá nhân khác nhau (với các username riêng) từ một tài khoản duy nhất |
| *Actor* | Người dùng (User) |
| *Pre-Condition* | Người dùng đã đăng nhập vào hệ thống. Người dùng đã có ít nhất một trang bio (đã hoàn thành U005). |
| *Result* | Người dùng có thể chuyển đổi Bảng điều khiển (Dashboard) sang một trang bio khác mà họ sở hữu. Hệ thống tạo và lưu một trang bio mới với username được tạo, liên kết với tài khoản người dùng |
| *Main Scenario* | Chuyển đổi giữa các trang bio Người dùng nhấn vào logo (hoặc tên trang bio hiện tại) trong Bảng điều khiển.  Hệ thống hiển thị một danh sách các "username" (trang bio) mà người dùng sở hữu. Người dùng chọn một "username" khác từ danh sách.  Hệ thống tải Bảng điều khiển (Dashboard) của trang bio (username) vừa chọn. Tạo trang bio mới Người dùng nhấn vào logo. Hệ thống hiển thị danh sách username và một nút "Tạo link bio mới".  Người dùng nhấn nút "Tạo link bio mới".  Hệ thống yêu cầu người dùng nhập "username" mới. Người dùng nhập "username" mong muốn. Hệ thống kiểm tra "username" real-time.  Hệ thống xác nhận "username" hợp lệ và duy nhất.  Người dùng nhấn "Xác nhận". Hệ thống tạo trang bio mới (ví dụ: vielink.vn/username\_moi) và chuyển người dùng đến Bảng điều khiển của trang mới đó. |
| *Alternatice Scenarios* | **6a. Username không hợp lệ:** Hệ thống hiển thị thông báo lỗi (ví dụ: "Tên người dùng không được chứa ký tự đặc biệt"). Kịch bản quay lại Bước 5\. **6b. Username đã tồn tại:** Hệ thống hiển thị thông báo lỗi (ví dụ: "Username này đã có người sử dụng"). Kịch bản quay lại Bước 5\.  |
| *Non-Functional Constraints* | **Hiệu năng:** Thời gian kiểm tra "username" real-time phải phản hồi dưới 1 giây.  |

      7. ### **Use Case 7**

| *Use case ID* | U007 |
| :---- | :---- |
| *Use Case*  | Tùy chỉnh Giao diện (Appearance) |
| *Brief Description* | Là Người dùng, tôi muốn tùy chỉnh sâu giao diện của trang bio (bao gồm nền, kiểu nút, và phông chữ) để phù hợp với thương hiệu cá nhân của mình. |
| *Actor* | Người dùng (User) |
| *Pre-Condition* | Người dùng đã đăng nhập vào hệ thống. Người dùng đang ở trong Bảng điều khiển (Dashboard) quản lý trang bio. |
| *Result* | Các thay đổi về giao diện (nền, nút, phông chữ) được lưu lại. Trang bio công khai của người dùng được cập nhật ngay lập tức với giao diện mới. |
| *Main Scenario* | Người dùng chọn tab "Giao diện" (Appearance) trong Bảng điều khiển. Hệ thống hiển thị các nhóm tùy chọn: Nền (Background), Nút (Buttons), Phông chữ (Fonts), và Màu chữ (Text Colors). Người dùng thực hiện một hoặc nhiều hành động sau: **Tùy chỉnh Nền:** Người dùng chọn màu đơn sắc , màu gradient , hoặc tải lên một ảnh nền riêng. **Tùy chỉnh Nút:** Người dùng chọn kiểu dáng nút (ví dụ: bo góc, vuông) , chọn màu sắc nút , và màu chữ trên nút. **Tùy chỉnh Phông chữ:** Người dùng chọn một phông chữ (từ danh sách Google Fonts) cho tiêu đề và nội dung **Tùy chỉnh Màu chữ:** Người dùng chọn màu sắc cho mô tả (description color) và màu sắc cho tên người dùng (@username color). **(Người dùng chọn "Thư viện mẫu")**: Hệ thống chuyển hướng người dùng sang thực hiện kịch bản của **Áp dụng Thư viện mẫu.** Khi người dùng thực hiện bất kỳ thay đổi nào (từ Bước 3), khung mô phỏng điện thoại ("Preview live") ở cột phải sẽ tự động render (phản ánh) thay đổi đó ngay lập tức mà không cần tải lại trang. Hệ thống tự động lưu lại các thay đổi của người dùng. |
| *Alternatice Scenarios* | **3a. Tải ảnh nền thất bại:** Nếu người dùng tải lên ảnh có định dạng không hỗ trợ hoặc dung lượng quá lớn (ví dụ: \>2MB). Hệ thống hiển thị thông báo lỗi (ví dụ: "Ảnh không hợp lệ, vui lòng chọn ảnh .JPG hoặc .PNG dưới 2MB"). Giao diện giữ nguyên cài đặt nền hiện tại. |
| *Non-Functional Constraints* | **Hiệu năng:** Khung "Preview live" phải cập nhật thay đổi (render) gần như ngay lập tức (dưới 0.5 giây) sau mỗi hành động của người dùng . **Tính khả dụng:** Giao diện quản trị phải trực quan, dễ sử dụng. Các công cụ (ví dụ: color picker) phải thân thiện . **Tương thích:** Trang bio công khai sau khi tùy chỉnh phải đảm bảo hiển thị responsive tối ưu trên mọi kích thước màn hình. |

      8. ### **Use Case 8**

| *Use case ID* | U008 |
| :---- | :---- |
| *Use Case*  | Áp dụng Thư viện mẫu (Template) |
| *Brief Description* | Là người dùng, tôi muốn áp dụng một mẫu giao diện có sẵn từ thư viện để nhanh chóng thay đổi toàn bộ giao diện trang bio của mình mà không cần tùy chỉnh từng chi tiết. |
| *Actor* | Người dùng (User) |
| *Pre-Condition* | Người dùng đã đăng nhập vào hệ thống. Người dùng đang ở trong tab "Giao diện" (Appearance) của Bảng điều khiển. |
| *Result* | Cài đặt giao diện hiện tại của người dùng (nền, nút, phông chữ) được ghi đè hoàn toàn bằng các cài đặt của mẫu đã chọn. Khung "Preview live" và trang bio công khai được cập nhật ngay lập tức theo giao diện của mẫu mới. |
| *Main Scenario* | Trong tab "Giao diện", người dùng chọn mục "Thư viện mẫu". Hệ thống hiển thị một danh sách (hoặc grid) các mẫu giao diện có sẵn đã được bản địa hóa cho thị trường Việt Nam. Người dùng nhấp vào một mẫu để trong thư viện. Hệ thống tự động cập nhật khung "Preview live" để người dùng xem giao diện của mẫu đó. Hệ thống ghi đè các cài đặt giao diện hiện tại (nền, nút, phông chữ) bằng cài đặt của mẫu đã chọn. |
| *Alternatice Scenarios* | **2a. Hệ thống chưa có mẫu nào có sẵn** Người dùng mở mục Thư viện mẫu trong tab Giao diện. Hệ thống kiểm tra và phát hiện không có mẫu nào trong thư viện. Hệ thống hiển thị thông báo: “Chưa có mẫu nào.” Khung Preview live giữ nguyên giao diện hiện tại vì không có nội dung để cập nhật. |
| *Non-Functional Constraints* | **Tính khả dụng:** Các mẫu phải được thiết kế phù hợp và bản địa hóa cho thị trường Việt Nam . |

      9. ### **Use case 9**

| Use case ID | U009 |
| :---- | :---- |
| Tên Use Case | Quản lý Khối Social Media (Social Media Blocks) |
| Brief Description | Là người dùng, tôi muốn thêm, sửa, xóa, sắp xếp, và ẩn/hiện các khối liên kết mạng xã hội trên trang bio của mình để quản lý và trình bày nội dung cho khách truy cập. |
| Actor | Người dùng (User) |
| Pre-Condition | Người dùng đã đăng nhập vào hệ thống. Người dùng đang ở trong Bảng điều khiển (Dashboard) quản lý trang bio. Người dùng đã có một trang bio (đã hoàn thành U001). |
| Result | Mọi thay đổi (thêm, sửa, xóa, sắp xếp, bật/tắt) đối với các khối liên kết đều được lưu lại. Khung "Preview live" và trang bio công khai được cập nhật ngay lập tức để phản ánh các thay đổi. |
| Main Scenario | 1\. Người dùng đang ở trong Bảng điều khiển, thấy danh sách các khối liên kết hiện có (cột trái) và khung "Preview live" (cột phải). 2\. Người dùng thực hiện một hoặc nhiều hành động sau: **(Tạo khối):** Người dùng nhấn nút "Thêm Social Media". Hệ thống chèn một khối mới vào danh sách. Người dùng nhập "Tiêu đề" và "URL" cho khối mới. Hệ thống tự động lưu. **(Cập nhật khối):** Người dùng nhấp vào một khối đã có. Các trường "Tiêu đề" và "URL" hiện ra. Người dùng chỉnh sửa thông tin. Hệ thống tự động lưu thay đổi. **(Xóa khối):** Người dùng nhấn vào biểu tượng "Xóa" (ví dụ: thùng rác) trên một khối. Hệ thống hiển thị hộp thoại xác nhận. Người dùng nhấn "Xác nhận". Hệ thống xóa khối đó khỏi danh sách và lưu lại. **(Sắp xếp thứ tự):** Người dùng nhấn giữ biểu tượng "kéo-thả" (ví dụ: 6 chấm) của một khối, kéo nó đến vị trí mới trong danh sách và thả ra. Hệ thống tự động lưu thứ tự mới. **(Bật/Tắt khối):** Người dùng nhấn vào nút "Hiển thị" (toggle) trên một khối. Nút toggle chuyển sang trạng thái "Ẩn". Hệ thống tự động lưu trạng thái mới. Khối đó biến mất khỏi "Preview live". 3\. Mọi thay đổi ở Bước 2 đều được phản ánh (render) ngay lập tức trên khung "Preview live". |
| Alternative Scenarios | **2c. Hủy xóa khối:** Tại Bước 2c, sau khi hệ thống hiển thị hộp thoại xác nhận, người dùng nhấn "Hủy bỏ". Hệ thống đóng hộp thoại. Khối liên kết không bị xóa và vẫn giữ nguyên vị trí. |
| Non-Functional Constraints | **Khả năng mở rộng:** Hệ thống không được giới hạn số lượng liên kết mà một người dùng có thể tạo. **Hiệu năng:** Khung "Preview live" phải cập nhật thay đổi (render) gần như ngay lập tức (dưới 0.5 giây) sau mỗi hành động (gõ phím, kéo-thả). **Tính khả dụng:** Thao tác kéo-thả (drag-and-drop) phải trực quan và mượt mà. **An toàn (Data Integrity):** Hệ thống nên có cơ chế tự động lưu (auto-save) sau mỗi thay đổi nhỏ để tránh mất dữ liệu khi người dùng thoát. |

      10. ### **Use case 10**

| *Use case ID* | U010 |
| :---- | :---- |
| *Use Case*  |  Gỡ bỏ logo (Branding) |
| *Brief Description* | Là Người dùng (Gói Pro), tôi muốn gỡ bỏ logo/thương hiệu của VieLink khỏi chân trang bio công khai của mình để tăng tính chuyên nghiệp và thương hiệu cá nhân. |
| *Actor* | Người dùng (User) (Phải thuộc Gói Pro) |
| *Pre-Condition* | Người dùng đã đăng nhập vào hệ thống. Người dùng đang ở trong trang "Cài đặt" (Settings). Tài khoản của người dùng là tài khoản trả phí (Gói Pro). |
| *Result* | Logo/dòng chữ "Powered by VieLink" (hoặc tương tự) bị ẩn đi khỏi trang bio công khai của người dùng. Khung "Preview live" cũng cập nhật trạng thái ẩn logo này. |
| *Main Scenario* | Người dùng truy cập trang "Cài đặt". Hệ thống kiểm tra và xác nhận người dùng thuộc "Gói Pro". Hệ thống hiển thị một nút bật/tắt (toggle) với tiêu đề "Hiển thị logo VieLink". Người dùng nhấn vào nút toggle để chuyển sang trạng thái "TẮT". Hệ thống lưu lại lựa chọn của người dùng. Hệ thống ngay lập tức ẩn logo/dòng chữ thương hiệu ở chân trang bio trong khung "Preview live" và trên trang bio công khai. |
| *Alternatice Scenarios* | **2a. Người dùng không thuộc Gói Pro:** Người dùng truy cập trang "Cài đặt". Hệ thống hiển thị tùy chọn "Hiển thị logo VieLink" nhưng ở trạng thái "khóa" (disabled). Khi người dùng nhấp vào, hệ thống hiển thị thông báo/pop-up mời nâng cấp lên "Gói Pro" để sử dụng tính năng này. |
| *Non-Functional Constraints* | **Bảo mật/Phân quyền:** Tính năng này bắt buộc chỉ được kích hoạt cho các tài khoản đã thanh toán "Gói Pro". **Hiệu năng:** Thay đổi phải được phản ánh ngay lập tức trên trang công khai sau khi người dùng bật/tắt. |

      11. ### **Use case 11**

| *Use case ID* | U011 |
| :---- | :---- |
| *Use Case*  | Cập nhật Mô tả cá nhân (Bio Description) |
| *Brief Description* | Là Người dùng, tôi muốn tự nhập hoặc chỉnh sửa nội dung văn bản trong phần Mô tả cá nhân (Bio) để giới thiệu về bản thân hoặc thương hiệu của mình trên trang bio. |
| *Actor* | Người dùng (User) |
| *Pre-Condition* | Người dùng đã đăng nhập vào hệ thống. Người dùng đang ở trong Bảng điều khiển (Dashboard) quản lý trang bio. |
| *Result* | Nội dung Mô tả cá nhân mới được lưu lại. Trang bio công khai và khung "Preview live" được cập nhật với nội dung văn bản mới. |
| *Main Scenario* | Người dùng truy cập khu vực chỉnh sửa trang bio. Người dùng tìm thấy ô nhập liệu "Mô tả cá nhân" (Bio Description). Người dùng thay đổi văn bản trực tiếp trong ô nhập liệu. Hệ thống tự động phản ánh (render) mọi thay đổi (kể cả từng ký tự) trong khung "Preview live" ở cột phải ngay lập tức. Hệ thống tự động lưu lại thay đổi sau khi người dùng ngừng gõ. |
| *Alternatice Scenarios* | **3a. Văn bản nhập vào vượt quá giới hạn ký tự:** Hệ thống hiển thị một bộ đếm ký tự và ngưng nếu quá 200 chữ. **3b. Người dùng nhấn nút "AI writer":** Kịch bản chính tạm dừng. Hệ thống chuyển sang thực hiện **Sử dụng AI writer**. |
| *Non-Functional Constraints* | **Hiệu năng:** Khung "Preview live" phải cập nhật thay đổi (render) gần như ngay lập tức (dưới 0.5 giây) sau mỗi ký tự được gõ. **Tính khả dụng:** Ô nhập liệu phải hỗ trợ xuống dòng và các thao tác chỉnh sửa văn bản cơ bản. |

      12. ### **Use case 12**

| *Use case ID* | U012 |
| :---- | :---- |
| *Use Case*  | Sử dụng AI writer (Trợ lý AI) |
| *Brief Description* | Là Người dùng, tôi muốn sử dụng Trợ lý AI để cải thiện/viết lại nội dung mô tả cá nhân của mình, sau đó chấp nhận (Accept) hoặc hủy bỏ (Cancel) thay đổi. |
| *Actor* | Người dùng (User) |
| *Pre-Condition* | Người dùng đã đăng ký tài khoản thành công . Người dùng đang thực hiện Use Case U005 ("Cập nhật Mô tả cá nhân") và đang ở trong ô nhập liệu "Mô tả cá nhân". |
| *Result* | Văn bản do AI viết lại được hiển thị. Nếu người dùng 'Accept', nội dung mới được áp dụng. Nếu 'Cancel', nội dung cũ được giữ nguyên. Khung "Preview live" cập nhật văn bản mới (nếu 'Accept').  |
| *Main Scenario* | Khi đang ở trong ô nhập liệu "Mô tả cá nhân", người dùng nhấn vào nút "AI writer" (hoặc biểu tượng "Trợ lý AI").  Hệ thống tự động lấy văn bản hiện tại đang có trong ô "Mô tả cá nhân".  Hệ thống gửi văn bản này đến dịch vụ AI để viết lại/cải thiện.  Hệ thống nhận văn bản đã được cải thiện từ AI. Hệ thống hiển thị văn bản mới (do AI tạo ra) cho người dùng xem xét, cùng với hai nút: "Accept" (Chấp nhận) và "Cancel" (Hủy). Người dùng nhấn "Accept". Hệ thống thay thế văn bản cũ trong ô "Mô tả cá nhân" bằng văn bản mới đã được cải thiện. Khung "Preview live" cập nhật. |
| *Alternatice Scenarios* | 6a. Người dùng nhấn "Cancel": Tại Bước 6, người dùng nhấn "Cancel". Hệ thống hủy bỏ văn bản do AI tạo. Nội dung trong ô "Mô tả cá nhân" được giữ nguyên như trước khi thực hiện. 4a. Dịch vụ AI lỗi hoặc quá tải:  Tại Bước 4, hệ thống không nhận được phản hồi hợp lệ từ dịch vụ AI.  Hệ thống hiển thị thông báo lỗi (ví dụ: "Trợ lý AI đang bận, vui lòng thử lại sau").  Nội dung trong ô "Mô tả cá nhân" được giữ nguyên như trước khi thực hiện. |
| *Non-Functional Constraints* | **Hiệu năng:** Thời gian phản hồi của Trợ lý AI (từ lúc nhấn "Tạo" đến khi trả về văn bản) nên dưới 10 giây để tránh làm gián đoạn luồng làm việc của người dùng. **Tính khả dụng:** Kết quả trả về của AI phải phù hợp với văn phong chuyên nghiệp và bối cảnh của một trang bio link. |

      13. ### **Use case 13**

| *Use case ID* | U013 |
| :---- | :---- |
| *Use Case*  | Thêm khối liên kết Thương mại Điện tử (TMĐT) |
| *Brief Description* | Là một affiliate marketer, tôi muốn thêm link sản phẩm từ Shopee/Lazada và trang tự động hiển thị hình ảnh, tên sản phẩm để thu hút người xem |
| *Actor* | Người dùng |
| *Pre-Condition* | Người dùng đang sử dụng thiết bị có kết nối Internet. Người dùng đã đăng nhập vào hệ thống (đã có phiên làm việc hợp lệ). Người dùng đang ở trong giao diện Bảng điều khiển (Dashboard) và trong chế độ chỉnh sửa trang bio. |
| *Result* | Một khối liên kết loại TMĐT mới được tạo và lưu vào cơ sở dữ liệu, gắn liền với trang bio của người dùng. Khối liên kết này chứa URL gốc, tên sản phẩm và URL hình ảnh đã được trích xuất. Khối mới được hiển thị ngay lập tức trong Bảng điều khiển và khung "Xem trước trực tiếp" dưới dạng một thẻ sản phẩm trực quan. Trang bio công khai được cập nhật để hiển thị khối sản phẩm mới này. |
| *Main Scenario* | Từ Bảng điều khiển, Người dùng nhấn vào nút "Thêm khối mới" (Add Block). Hệ thống hiển thị một danh sách các loại khối khả dụng. Người dùng chọn loại khối "Sản phẩm TMĐT". Giao diện hiển thị một ô nhập liệu yêu cầu "URL sản phẩm". Người dùng sao chép và dán một URL sản phẩm hợp lệ vào ô nhập liệu. Người dùng nhấn nút "Thêm" (Add). Giao diện hiển thị một chỉ báo tải (loading spinner) trong khi chờ xử lý. Hệ thống gửi URL này đến Application Server. Application Server (Backend) nhận URL và kiểm tra domain, xác nhận đây là link từ `shopee.vn` hoặc `lazada.vn`. Server thực hiện một yêu cầu đến URL sản phẩm để trích xuất thông tin: Tên sản phẩm và URL hình ảnh chính. Server lưu trữ thông tin này (URL gốc, tên sản phẩm, URL ảnh đã trích xuất) vào cơ sở dữ liệu, gắn với trang bio của người dùng. Dữ liệu này cũng được lưu vào bộ đệm. Server trả về thông báo thành công và dữ liệu của khối mới cho Client. Client nhận dữ liệu, ẩn chỉ báo tải và render khối sản phẩm mới trong danh sách quản lý cũng như trong khung "Xem trước trực tiếp", hiển thị rõ ràng ảnh và tên sản phẩm. |
| *Alternatice Scenarios* | **5a. Người dùng dán URL không được hỗ trợ (domain không phải Shopee/Lazada):** Người dùng nhấn "Thêm" (Bước 6). Hệ thống (kiểm tra ở Client hoặc Server) phát hiện domain không hợp lệ. Hệ thống hiển thị thông báo lỗi ngay tại ô nhập liệu: "URL không được hỗ trợ. Vui lòng sử dụng link từ Shopee hoặc Lazada." Use case quay lại Bước 4\. **10a. Không thể trích xuất thông tin (URL lỗi, sản phẩm không tồn tại, hoặc bị nền tảng TMĐT chặn):** Server thực hiện yêu cầu (Bước 10\) nhưng nhận về lỗi. Server trả về thông báo lỗi cho Client. Client ẩn chỉ báo tải, hiển thị thông báo lỗi: "Không thể lấy thông tin sản phẩm. Vui lòng kiểm tra lại URL hoặc thử lại sau." Use case quay lại Bước 4\. **10b. URL hợp lệ nhưng không tìm thấy ảnh hoặc tên (thông tin bị thiếu):** Server chỉ lấy được một phần thông tin. Hệ thống vẫn tiếp tục Bước 11, nhưng sử dụng ảnh đại diện mặc định (placeholder image) và tên đã trích xuất được. Use case tiếp tục từ Bước 11\. **7a. Mất kết nối Internet:** Người dùng nhấn "Thêm" (Bước 6\) nhưng thiết bị mất kết nối Internet. Hệ thống không thể gửi yêu cầu đến Server. Client ẩn chỉ báo tải, hiển thị thông báo lỗi: "Mất kết nối Internet. Vui lòng kiểm tra và thử lại." |
| *Non-Functional Constraints* | Quá trình trích xuất thông tin sản phẩm (Bước 10\) phải hoàn tất trong vòng 3 giây để không làm người dùng chờ đợi lâu. Cơ chế trích xuất (parser/scraper) phải được thiết kế để có khả năng chống chịu (resilient) với các thay đổi nhỏ về cấu trúc HTML của Shopee/Lazada. Dữ liệu sản phẩm (tên, ảnh) sau khi trích xuất lần đầu phải được lưu cache ít nhất 24 giờ. Khi hiển thị trên trang bio công khai, hệ thống phải ưu tiên lấy dữ liệu từ cache để tăng tốc độ tải trang và giảm số lần truy cập API/scraping. Mọi URL do người dùng nhập phải được khử trùng (sanitize) ở phía server trước khi server thực hiện yêu cầu đến URL đó để ngăn chặn các cuộc tấn công. |

      14. ### **Use case 14**

| *Use case ID* | U014 |
| :---- | :---- |
| *Use Case*  | Thêm khối Ủng hộ (Donate/Tips) |
| *Brief Description* | Là người sáng tạo nội dung, tôi muốn người hâm mộ có thể ủng hộ tôi trực tiếp qua các ví điện tử phổ biến tại Việt Nam (Momo, ZaloPay) |
| *Actor* | Người dùng |
| *Pre-Condition* | Người dùng đã đăng nhập vào hệ thống. Người dùng đang ở trong giao diện Bảng điều khiển (Dashboard) và trong chế độ chỉnh sửa trang bio. Người dùng đã chuẩn bị sẵn thông tin nhận tiền (ví dụ: ảnh mã QR của VietQR/Momo, hoặc link nhận tiền của Momo `momo.me/...`). |
| *Result* | Một khối "Ủng hộ" mới được tạo và lưu vào cơ sở dữ liệu, liên kết với trang bio của người dùng, chứa thông tin phương thức và dữ liệu (ảnh QR hoặc link). Khối mới hiển thị trong Bảng điều khiển và khung "Xem trước trực tiếp" với tiêu đề nút mà người dùng đã đặt. Trang bio công khai được cập nhật, hiển thị nút "Ủng hộ" này. |
| *Main Scenarios* | Từ Bảng điều khiển, Người dùng nhấn vào nút "Thêm khối mới". Hệ thống hiển thị danh sách các loại khối. Người dùng chọn loại khối "Ủng hộ" (Donate). Giao diện hiển thị một form cấu hình cho khối mới, yêu cầu các thông tin bắt buộc: Tiêu đề nút. Chọn phương thức (Dropdown: Momo, ZaloPay, VietQR). Người dùng nhập "Tiêu đề nút". Người dùng chọn một phương thức, ví dụ: "VietQR". Hệ thống hiển thị một trường "Tải lên ảnh mã QR". Người dùng nhấn vào trường đó, mở cửa sổ tệp, chọn và tải lên một tệp ảnh (.png, .jpg) chứa mã QR của mình. Hệ thống hiển thị ảnh QR đã tải lên trong form cấu hình. Người dùng nhấn nút "Lưu" (Save). Hệ thống kiểm tra thông tin hợp lệ (Tiêu đề nút đã nhập, Ảnh QR đã tải lên). Hệ thống lưu cấu hình khối (loại phương thức, tiêu đề, URL của ảnh QR đã lưu trữ) vào cơ sở dữ liệu. Client nhận thông báo lưu thành công, render khối mới trong danh sách quản lý và khung "Xem trước". Khi Khách truy cập vào trang bio công khai, họ thấy nút chứa tiêu đề mà chủ bio dùng. Khi nhấn vào, hệ thống hiển thị một cửa sổ pop-up (modal) chứa hình ảnh mã QR (đã tải lên ở Bước 8\) để họ có thể quét và chuyển khoản. |
| *Alternatice Scenarios* | **7a. Người dùng chọn phương thức "Link" (ví dụ: Momo) thay vì tải ảnh QR:** Người dùng chọn phương thức "Momo" (Bước 6). Hệ thống hiển thị trường nhập liệu: "Link nhận tiền Momo". Người dùng dán link vào và nhấn "Lưu" (Bước 10). Khi Khách truy cập nhấn vào nút chứa tiêu đề (Bước 14): Nếu khách đang dùng *máy tính*, hệ thống mở link `momo.me/...` trong một tab mới. Nếu khách đang dùng *di động*, hệ thống mở link đó, kích hoạt ứng dụng Momo (nếu đã cài đặt) để chuyển tiền. **8a. Người dùng tải lên tệp không phải định dạng ảnh:** Người dùng chọn tải lên một tệp cho ảnh QR. Hệ thống phát hiện định dạng tệp không hợp lệ. Hiển thị thông báo lỗi: "Định dạng tệp không hợp lệ. Vui lòng chỉ chọn ảnh (.PNG, .JPG, .JPEG)." Use case quay lại Bước 8\. **11a. Người dùng nhấn "Lưu" nhưng thiếu thông tin bắt buộc:** Người dùng nhấn "Lưu" (Bước 10\) nhưng chưa nhập "Tiêu đề nút" hoặc chưa tải ảnh/nhập link (Bước 7/7a). Hệ thống (Client-side validation) hiển thị thông báo lỗi tại vị trí trường bị thiếu, ví dụ: "Tiêu đề nút không được để trống" hoặc "Vui lòng tải ảnh QR/nhập link nhận tiền." Use case quay lại Bước 5\. |
| *Non-Functional Constraints* | Mọi tệp ảnh do người dùng tải lên (ảnh QR) phải được lưu trữ an toàn và phải được quét/lọc để đảm bảo không chứa mã độc. Pop-up hiển thị mã QR (kịch bản 14\) phải rõ ràng, hiển thị ảnh QR lớn, dễ quét, và có nút "Đóng" (Close) rõ ràng. Ảnh QR tải lên phải được tối ưu hóa (nén, chuyển đổi định dạng) để đảm bảo tốc độ tải nhanh trên trang bio công khai. |

      15. ### **Use case 15**

| *Use case ID* | U015 |
| :---- | :---- |
| *Use Case*  | Khối biểu mẫu liên hệ (Contact Form). |
| *Brief Description* | Là một freelancer, tôi muốn thêm biểu mẫu liên hệ trên trang để khách hàng tiềm năng có thể dễ dàng gửi yêu cầu cho tôi. |
| *Actor* | Khách truy cập |
| *Pre-Condition* | Khách truy cập đang xem một trang bio công khai có kết nối Internet. Trang bio này đã được Người dùng cấu hình và kích hoạt "Khối Biểu mẫu Liên hệ". Hệ thống đã biết email đã đăng ký của Người dùng để làm địa chỉ nhận tin nhắn. |
| *Result* | **Thành công:** Nội dung biểu mẫu (Họ tên, Email, Tin nhắn) được gửi thành công đến email đã đăng ký của chủ trang bio. Giao diện biểu mẫu trên trang bio hiển thị thông báo "Gửi thành công\!" cho Khách truy cập. **Thất bại:** Hệ thống hiển thị thông báo lỗi cụ thể cho Khách truy cập và không gửi tin nhắn đi. |
| *Main Scenarios* | Khách truy cập truy cập vào trang bio công khai. Khách truy cập tìm thấy "Khối Biểu mẫu Liên hệ" (ví dụ, có tiêu đề "Liên hệ với tôi"). Hệ thống hiển thị các trường: "Họ tên", "Email" (bắt buộc), "Nội dung tin nhắn" (bắt buộc), và một nút "Gửi". Khách truy cập điền đầy đủ thông tin vào các trường. Khách truy cập nhấn nút "Gửi". Hệ thống thực hiện kiểm tra dữ liệu đầu vào: Kiểm tra trường "Email" và "Nội dung tin nhắn" không được để trống. Kiểm tra trường "Email" phải đúng định dạng. Tất cả thông tin đều hợp lệ. Hệ thống hiển thị một chỉ báo đang tải (loading) và gửi dữ liệu biểu mẫu (tên, email, nội dung) cùng với ID của chủ trang bio đến Application Server. Application Server (Backend) nhận dữ liệu. Server lấy thông tin email đã đăng ký của chủ trang bio từ cơ sở dữ liệu. Server sử dụng một dịch vụ gửi email để gửi một email đến chủ trang bio, nội dung email chứa thông tin Khách truy cập đã nhập. Server trả về thông báo thành công cho Client. Client nhận phản hồi thành công, ẩn chỉ báo tải. Client xóa nội dung trong các ô nhập liệu và hiển thị thông báo "Gửi thành công\! Cảm ơn bạn đã liên hệ." tại vị trí biểu mẫu. |
| *Alternatice Scenarios* | **6a. Khách truy cập điền thiếu trường bắt buộc (Email hoặc Nội dung):** Khách truy cập nhấn "Gửi" (Bước 5). Hệ thống kiểm tra (Bước 6\) và phát hiện trường bắt buộc bị thiếu. Hiển thị thông báo lỗi ngay dưới trường bị thiếu: "Trường này không được để trống." Use case quay lại Bước 4 (chờ người dùng nhập lại). **6b. Khách truy cập nhập sai định dạng Email:** Khách truy cập nhấn "Gửi" (Bước 5). Hệ thống kiểm tra (Bước 6\) và phát hiện định dạng email không hợp lệ. Hiển thị thông báo lỗi dưới ô Email: "Vui lòng nhập một địa chỉ email hợp lệ." Use case quay lại Bước 4\. **7a. Mất kết nối Internet:** Khách truy cập nhấn "Gửi" (Bước 5). Dữ liệu hợp lệ (Bước 6). Client cố gắng gửi dữ liệu (Bước 7\) nhưng thất bại do không có kết nối Internet. Hệ thống ẩn chỉ báo tải và hiển thị thông báo lỗi: "Gửi thất bại. Vui lòng kiểm tra kết nối Internet và thử lại." **10a. Lỗi phía Server (ví dụ: dịch vụ email không hoạt động):** Server cố gắng gửi email (Bước 10\) nhưng dịch vụ email bị lỗi hoặc cấu hình sai. Server ghi nhận lỗi và trả về thông báo lỗi cho Client. Client nhận phản hồi lỗi, ẩn chỉ báo tải và hiển thị thông báo: "Đã có lỗi xảy ra phía máy chủ. Vui lòng thử lại sau." |
| *Non-Functional Constraints* | Biểu mẫu phải được bảo vệ bởi một cơ chế chống spam để ngăn chặn bot tự động gửi biểu mẫu hàng loạt. Thời gian từ lúc Khách truy cập nhấn "Gửi" đến khi nhận được thông báo "Gửi thành công" (Kịch bản chính) phải dưới 3 giây. Email gửi cho chủ trang bio phải có tiêu đề rõ ràng và nội dung được định dạng sạch sẽ, dễ đọc. Dữ liệu biểu mẫu phải được gửi từ Client đến Server qua giao thức HTTPS. |

      16. ### **Use case 16**

| *Use case ID* | U016 |
| :---- | :---- |
| *Use Case*  | Thêm khối Liên hệ nhanh (Chat Zalo) |
| *Brief Description* | Là người bán hàng online, tôi muốn có nút Zalo để khách hàng có thể nhắn tin trực tiếp cho tôi chỉ với một cú nhấp chuột. |
| *Actor* | Người dùng |
| *Pre-Condition* | Người dùng đã đăng nhập vào hệ thống. Người dùng đang ở trong giao diện Bảng điều khiển (Dashboard) và trong chế độ chỉnh sửa trang bio. Người dùng có một số điện thoại đã đăng ký và sử dụng Zalo. |
| *Result* | Một khối "Zalo Chat" mới được tạo và lưu vào cơ sở dữ liệu, chứa thông tin tiêu đề nút và số điện thoại Zalo. Khối mới được hiển thị trong Bảng điều khiển và khung "Xem trước trực tiếp". Trang bio công khai được cập nhật, hiển thị một nút có chức năng chuyển hướng đến Zalo. |
| *Main Scenarios* | Từ Bảng điều khiển, Người dùng nhấn vào nút "Thêm khối mới". Hệ thống hiển thị danh sách các loại khối. Người dùng chọn loại khối "Liên hệ nhanh" hoặc "Chat Zalo". Giao diện hiển thị một form cấu hình, yêu cầu các thông tin: Tiêu đề nút. Số điện thoại Zalo (bắt buộc). Người dùng nhập "Tiêu đề nút" (nếu không nhập, hệ thống sẽ sử dụng tiêu đề mặc định là "Chat Zalo"). Người dùng nhập "Số điện thoại Zalo" Người dùng nhấn nút "Lưu" (Save). Hệ thống thực hiện kiểm tra dữ liệu đầu vào: Kiểm tra trường "Số điện thoại Zalo" không được để trống. Kiểm tra "Số điện thoại Zalo" phải có định dạng hợp lệ. Tất cả thông tin đều hợp lệ. Hệ thống lưu cấu hình khối (tiêu đề, số điện thoại) vào cơ sở dữ liệu. Client nhận thông báo lưu thành công, render khối mới trong danh sách quản lý, hiển thị nút "Chat Zalo" trong khung "Xem trước". Khi Khách truy cập vào trang bio công khai, họ thấy nút "Chat Zalo" (hoặc tiêu đề tùy chỉnh) mà Người dùng đã cấu hình. Khi Khách truy cập nhấp vào nút này, trình duyệt thực hiện hành động mở URI. |
| *Alternatice Scenarios* | **8a. Người dùng nhấn "Lưu" nhưng không nhập Số điện thoại:** Người dùng nhấn "Lưu" (Bước 7\) nhưng để trống trường "Số điện thoại Zalo". Hệ thống kiểm tra (Bước 8\) và phát hiện trường bắt buộc bị thiếu. Hiển thị thông báo lỗi ngay dưới trường số điện thoại: "Vui lòng nhập số điện thoại Zalo của bạn." Use case quay lại Bước 6\. **8b. Người dùng nhập Số điện thoại sai định dạng:** Người dùng nhấn "Lưu" (Bước 7\) nhưng nhập "abc" hoặc "123" vào trường số điện thoại. Hệ thống kiểm tra (Bước 8\) và phát hiện định dạng không hợp lệ. Hiển thị thông báo lỗi: "Định dạng số điện thoại không hợp lệ. Vui lòng nhập 10 số, bắt đầu bằng 0." Use case quay lại Bước 6\. |
| *Non-Functional Constraints* | Nút bấm trên trang bio công khai nên có biểu tượng của Zalo bên cạnh Tiêu đề nút để tăng khả năng nhận diện thương hiệu và sự tin cậy. Hành động mở URI phải được kiểm thử để hoạt động chính xác trên cả trình duyệt máy tính (mở Zalo Web/Zalo PC) và trình duyệt di động (kích hoạt mở ứng dụng Zalo). |

      17. ### **Use case 17**

| *Use case ID* | U017 |
| :---- | :---- |
| *Use Case*  | Xem Phân tích Cơ bản |
| *Brief Description* | Cho phép người dùng (chủ trang bio link) xem các chỉ số hiệu suất chính của trang như tổng lượt xem và chi tiết lượt nhấp vào từng liên kết. Tính năng này giúp người dùng hiểu được mức độ tương tác của khán giả với trang của họ.  |
| *Actor* | Người dùng (chủ trang bio link) |
| *Pre-Condition* | Người dùng đã đăng nhập thành công vào hệ thống. Trang bio link của người dùng đã có ít nhất một lượt xem hoặc lượt nhấp để dữ liệu có thể hiển thị. |
| *Result* | Người dùng xem được bảng điều khiển phân tích với các số liệu được cập nhật. Người dùng có thể đưa ra quyết định dựa trên dữ liệu về liên kết nào đang hoạt động hiệu quả.  |
| *Main Scenario* | Người dùng đăng nhập và truy cập vào Bảng điều khiển chính. Người dùng nhấn vào tab “Phân tích” (Analytics). Hệ thống tải và hiển thị giao diện phân tích, mặc định hiển thị dữ liệu cho 7 ngày gần nhất. Trên giao diện, hệ thống hiển thị rõ ràng các chỉ số tổng quan: Tổng số lượt xem trang (Page Views). Tổng số lượt nhấp vào liên kết (Link Clicks). Bên dưới các chỉ số tổng quan, hệ thống hiển thị một danh sách chi tiết tất cả các liên kết có trên trang bio link. Với mỗi liên kết trong danh sách, hệ thống hiển thị tổng số lượt nhấp (clicks) mà liên kết đó đã nhận được trong khoảng thời gian đã chọn. |
| *Alternatice Scenarios* | 3a. Trang chưa có dữ liệu: Nếu trang bio link còn mới và chưa có lượt xem/nhấp nào, khi người dùng vào tab "Phân tích", hệ thống sẽ hiển thị một thông báo thân thiện thay vì các con số 0\.  3b. Lỗi khi tải dữ liệu:  Nếu có lỗi xảy ra trong quá trình truy xuất dữ liệu từ cơ sở dữ liệu, hệ thống sẽ hiển thị một thông báo lỗi.  |
| *Non-Functional Constraints* | **Hiệu năng:** Dữ liệu phân tích phải được tải và hiển thị nhanh chóng (dưới 2 giây) để đảm bảo trải nghiệm người dùng tốt, ngay cả khi lượng dữ liệu lớn. **Độ chính xác dữ liệu:** Hệ thống phải có cơ chế ghi log chính xác, hạn chế việc đếm các lượt truy cập từ bot (nếu có thể). Số liệu nên được cập nhật gần với thời gian thực. **Tính khả dụng:** Giao diện phải trực quan, dễ đọc, dễ hiểu. Các chỉ số phải được đặt tên rõ ràng. |

      18. ### **Use case 18**

| *Use case ID* | U018 |
| :---- | :---- |
| *Use Case*  | Phân tích Nguồn truy cập |
| *Brief Description* | Cho phép người dùng xác định lưu lượng truy cập đến trang bio link của họ đến từ đâu (ví dụ: Facebook, TikTok, truy cập trực tiếp). Tính năng này giúp người dùng đánh giá hiệu quả của các kênh quảng bá. |
| *Actor* | Người dùng (chủ trang bio link) |
| *Pre-Condition* | Người dùng đã đăng nhập và đang ở trong tab “Phân tích”. Trang bio link đã nhận được các lượt truy cập có thông tin HTTP Referer. |
| *Result* | Người dùng thấy được một biểu đồ trực quan về tỷ lệ truy cập từ các nguồn khác nhau. Người dùng có thể quyết định nên tập trung nỗ lực quảng bá vào kênh nào hiệu quả nhất. |
| *Main Scenario* | Người dùng đang ở trong tab “Phân tích”. Người dùng cuộn xuống hoặc tìm đến khu vực có tiêu đề “Nguồn truy cập” (Traffic Sources). Hệ thống phân tích HTTP Referer từ dữ liệu lượt xem đã được ghi lại. Hệ thống gom nhóm các referer theo tên miền gốc (ví dụ: tất cả các URL từ m.facebook.com, l.facebook.com đều được nhóm thành Facebook). Các lượt truy cập không có referer sẽ được nhóm vào “Truy cập trực tiếp” (Direct). Hệ thống hiển thị dữ liệu dưới dạng một biểu đồ tròn (Pie Chart). Mỗi phần của biểu đồ tròn đại diện cho một nguồn truy cập, với tỷ lệ phần trăm tương ứng được hiển thị. Ví dụ: Facebook: 45%, TikTok: 30%, Truy cập trực tiếp: 25%. Hệ thống hiển thị một chú thích (legend) đi kèm để làm rõ màu sắc tương ứng với từng nguồn. Khi người dùng thay đổi bộ lọc thời gian (7 ngày/30 ngày), biểu đồ nguồn truy cập cũng sẽ được cập nhật tương ứng. |
| *Alternatice Scenarios* | **4a. Chỉ có một nguồn truy cập:**  Nếu tất cả lượt truy cập đều không có referer, biểu đồ sẽ hiển thị một hình tròn duy nhất với nhãn "Truy cập trực tiếp: 100%". **4b. Có quá nhiều nguồn truy cập nhỏ lẻ:**  Để biểu đồ không bị rối, hệ thống sẽ gom tất cả các nguồn có tỷ lệ dưới một ngưỡng nhất định vào một nhóm chung là “Khác”.  |
| *Non-Functional Constraints* | **Tính riêng tư:** Hệ thống chỉ được phân tích và hiển thị tên miền gốc của referer, không được hiển thị đường dẫn URL đầy đủ để bảo vệ quyền riêng tư của người truy cập. **Khả năng mở rộng:** Thuật toán phân tích và gom nhóm referer phải hiệu quả để xử lý hàng triệu lượt truy cập mà không làm chậm hệ thống. **Trực quan hóa:** Biểu đồ phải rõ ràng, dễ đọc, có màu sắc phân biệt tốt và phải hiển thị tốt trên cả máy tính và thiết bị di động (responsive). |

      19. ### **Use case 19**

| *Use case ID* | U019 |
| :---- | :---- |
| *Use Case*  | Tạo và Tải xuống Mã QR |
| *Brief Description* | Cung cấp cho người dùng một mã QR được tạo tự động, chứa đường dẫn đến trang bio link của họ. Người dùng có thể tải mã QR này về để sử dụng trên các ấn phẩm vật lý (danh thiếp, poster) hoặc kỹ thuật số, giúp mọi người dễ dàng truy cập trang của họ bằng cách quét mã. |
| *Actor* | Người dùng (chủ trang bio link) |
| *Pre-Condition* | Người dùng đã đăng nhập vào hệ thống. Người dùng đã tạo thành công trang bio link và có một URL công khai (ví dụ: https://vielink.vn/username). |
| *Result* | Người dùng có được một tệp ảnh chứa mã QR của trang bio link trên thiết bị của mình. Người dùng có thể sử dụng tệp ảnh này để chia sẻ trang bio link của mình. |
| *Main Scenario* | Người dùng đăng nhập và truy cập Bảng điều khiển. Người dùng điều hướng đến khu vực “Chia sẻ”. Hệ thống tự động hiển thị một hình ảnh mã QR đã được tạo sẵn. Dữ liệu được mã hóa trong mã QR này chính là URL công khai của trang bio link của người dùng. Bên cạnh hoặc bên dưới hình ảnh mã QR, hệ thống cung cấp nút “Tải xuống”. Người dùng nhấn vào nút “Tải xuống”. Hệ thống tạo và gửi tệp ảnh mã QR về trình duyệt của người dùng. Trình duyệt bắt đầu quá trình tải tệp xuống thiết bị của người dùng. |
| *Alternatice Scenarios* | 2a. Người dùng chưa tạo trang bio link:  Nếu người dùng chưa có username (URL công khai), khu vực "Chia sẻ" sẽ bị vô hiệu hóa hoặc hiển thị thông báo hướng dẫn người dùng tạo trang trước. 6a. Lỗi trong quá trình tạo tệp:  Nếu có sự cố xảy ra trên server khi tạo tệp ảnh (ví dụ: lỗi thư viện), hệ thống sẽ hiển thị một thông báo lỗi ngắn gọn cho người dùng. |
| *Non-Functional Constraints* | Độ tin cậy (Reliability): Mã QR được tạo ra phải chính xác và có thể quét được bởi hầu hết các ứng dụng quét mã QR phổ biến. Chất lượng (Quality): Định dạng .PNG phải có độ phân giải đủ cao để hiển thị rõ nét. Định dạng .SVG (Scalable Vector Graphics) phải là vector chuẩn, cho phép người dùng thay đổi kích thước mà không bị vỡ hình, phù hợp cho việc in ấn chuyên nghiệp. Hiệu năng (Performance): Mã QR phải được render và hiển thị gần như ngay lập tức khi người dùng truy cập vào trang "Chia sẻ". Quá trình tạo và tải tệp cũng phải diễn ra nhanh chóng. |

      20. ### **Use case 20**

| *Use case ID* | U020 |
| :---- | :---- |
| *Use Case*  | Cấu hình Tên miền Tùy chỉnh |
| *Brief Description* | Cho phép người dùng trả phí (gói Pro) kết nối tên miền riêng của họ (ví dụ: mybrand.vn) với trang bio link trên VieLink. Điều này giúp tăng cường nhận diện thương hiệu và tạo ra một trải nghiệm chuyên nghiệp, liền mạch cho người truy cập. |
| *Actor* | Người dùng (chủ trang bio link) |
| *Pre-Condition* | Người dùng đã đăng nhập vào hệ thống. Tài khoản của người dùng đã được nâng cấp lên gói trả phí (Pro). Người dùng đã sở hữu một tên miền riêng và có quyền truy cập vào bảng quản trị DNS của tên miền đó. |
| *Result* | Nếu thành công, trang bio link của người dùng có thể được truy cập thông qua tên miền riêng của họ. Hệ thống ghi nhận và lưu lại cấu hình tên miền tùy chỉnh cho tài khoản người dùng. |
| *Main Scenario* | Người dùng truy cập vào mục “Cài đặt” (Settings) trong Bảng điều khiển. Người dùng tìm và nhấn vào mục “Tên miền Tùy chỉnh” (Custom Domain). Hệ thống hiển thị một ô nhập liệu để người dùng nhập tên miền riêng của họ. Người dùng nhập tên miền của mình vào (ví dụ: mybrand.vn) và nhấn nút tiếp theo (ví dụ: "Thêm"). Hệ thống hiển thị một trang hướng dẫn chi tiết. Người dùng chuyển sang trang quản trị DNS của họ và thực hiện cấu hình theo hướng dẫn. Sau khi đã cấu hình DNS, người dùng quay lại trang VieLink và nhấn nút “Xác thực” (Verify/Authenticate). Hệ thống (server) thực hiện một truy vấn DNS để kiểm tra bản ghi CNAME của tên miền mà người dùng đã nhập. Nếu bản ghi DNS đã được cập nhật và trỏ đúng về cname.vielink.vn, hệ thống sẽ hiển thị thông báo "Xác thực thành công\! Tên miền của bạn đã được kết nối.". Trang bio link của người dùng giờ đây có thể truy cập qua tên miền đó. |
| *Alternatice Scenarios* | 2a. Người dùng chưa đăng ký gói Pro: Khi nhấn vào mục "Tên miền Tùy chỉnh", hệ thống sẽ hiển thị thông báo đây là tính năng trả phí và cung cấp một nút để người dùng tìm hiểu hoặc nâng cấp gói. 4a. Tên miền không hợp lệ hoặc đã được sử dụng:  Nếu người dùng nhập một chuỗi không phải là tên miền hợp lệ, hoặc tên miền đó đã được một người dùng khác trên VieLink sử dụng, hệ thống sẽ báo lỗi. 9a. Xác thực thất bại:  Nếu hệ thống kiểm tra và không tìm thấy bản ghi CNAME chính xác (do người dùng cấu hình sai hoặc DNS chưa kịp cập nhật), hệ thống sẽ hiển thị thông báo lỗi: "Xác thực thất bại. Chúng tôi không tìm thấy bản ghi CNAME chính xác. Vui lòng kiểm tra lại cấu hình hoặc đợi thêm và thử lại." |
| *Non-Functional Constraints* | **Bảo mật:** Hệ thống phải có cơ chế đảm bảo rằng một tên miền chỉ có thể được sử dụng bởi một tài khoản duy nhất để tránh xung đột và chiếm dụng. **Độ tin cậy:** Quá trình kiểm tra DNS phải chính xác. Sau khi kết nối thành công, hệ thống phải đảm bảo việc phục vụ (serving) trang bio link qua tên miền tùy chỉnh có độ sẵn sàng cao. Hệ thống nên tự động cấp phát chứng chỉ SSL/TLS cho tên miền tùy chỉnh để đảm bảo truy cập qua HTTPS. **Tính khả dụng:** Hướng dẫn cấu hình DNS phải cực kỳ rõ ràng, đơn giản và dễ hiểu cho cả những người dùng không chuyên về kỹ thuật. |

# 