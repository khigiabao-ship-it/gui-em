# Kể từ khi có em

Một câu chuyện tình cảm bằng bảy hoạt cảnh: cuộc sống đen trắng → bình luận trên Threads → nhắn tin → gặp nhau → cái ôm và nụ hôn → thêm kỷ niệm → thế giới có màu sắc hơn.

Nội dung dựa trên những mốc do người kể cung cấp. Slide Threads chép bài viết và bình luận từ hai ảnh do người kể cung cấp: tác giả `fiwegh`, tên người bình luận đổi thành `lamtinhvoinguoila`. Giữ nội dung, ngày và số tương tác trong ảnh; khung tin nhắn ở cảnh sau vẫn là minh họa. Phần Threads cuộn được trên màn hình nhỏ để giữ chữ dễ đọc. Nhân vật được vẽ theo ảnh tham khảo của hai người, giữ phong cách tranh gouache; cảnh nền mang tính minh họa.

Phiên bản nhân vật cá nhân hóa dùng các ảnh `him-v3.webp`, `her-v2.webp` và `together-v3.webp`. Bạn nam tóc layer, đeo kính, mặc sơ mi trắng mềm rũ hơi rộng và quần suông đen cạp cao; đầu được thu nhỏ nhẹ và phần áo ngắn hơn để tôn tỷ lệ chân. Bạn nữ tóc dài. Cảnh mở đầu là bạn nam ngồi ở góc tường, gục đầu lên tay (`seated-v4.webp`). Cảnh cuối lần lượt dang tay, chạy tới ôm và hơi ngả ra sau, dùng ba tư thế `welcome-v4.webp`, `running-v4.webp` và `catch-v4.webp`; chuyển động chạy lại khi vào lại cảnh, giữ cái ôm ở cuối và hiện ngay cái ôm khi thiết bị bật giảm chuyển động. Các cảnh đứng chung dùng tỷ lệ chiều cao `154 / 173`, với hai nhân vật cùng đường chân. Ảnh tham khảo gốc không nằm trong mã nguồn website.

## Chạy và xuất bản

Website tĩnh nằm trong `dist/`. Mở `dist/index.html` hoặc phục vụ thư mục `dist` bằng máy chủ tĩnh. Không cần npm hay bước build. Đưa các tệp trong `dist` vào một thư mục riêng trên GitHub Pages để có đường dẫn độc lập.

Trên GitHub, các tệp trong `dist/` được đặt trực tiếp trong thư mục `chuyen-chung-minh/`.

## Sử dụng

- Bấm Cảnh tiếp / Trở lại, chọn chương, cuộn nhẹ hoặc dùng phím trái/phải.
- Trên điện thoại, vuốt ngang trên hoạt cảnh để chuyển.
- Bấm Xem như phim để tự chuyển cảnh sau 14–30 giây. Phim dừng ở cảnh cuối; có thể xem lại từ đầu.
- Nhấn Space để bật/tạm dừng phim khi không đứng trên nút, Home / End để về đầu / cuối.
- Menu các chương hỗ trợ bàn phím. Tự chạy tạm dừng khi mở menu và khi tab bị ẩn.
- Tôn trọng cài đặt giảm chuyển động của thiết bị. Không tự chạy khi mới vào trang.

Lời kể nằm trong `dist/index.html`, chuyển cảnh trong `dist/story.js`, hình thức trong `dist/style.css`. Ảnh, phông chữ và biểu tượng đều tải từ cùng thư mục; không phụ thuộc CDN, không theo dõi người xem và không thu thập dữ liệu.

Tranh nền, hai nhân vật và tranh ôm nhau được tạo riêng cho website, sau đó mã hóa WebP để tải nhanh. Phông chữ Noto Serif và Open Sans được đóng gói cục bộ kèm giấy phép trong `dist/assets/FONT-LICENSES.txt`.
