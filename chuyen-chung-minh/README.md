# Kể từ khi có em

Một câu chuyện tình cảm bằng bảy hoạt cảnh: cuộc sống đen trắng → bình luận trên Threads → nhắn tin → gặp nhau → cái ôm và nụ hôn → thêm kỷ niệm → thế giới có màu sắc hơn.

Nội dung dựa trên những mốc do người kể cung cấp. Các khung Threads và tin nhắn là minh họa; không chép hay tự dựng lời trò chuyện thật. Nhân vật và cảnh nền là tranh minh họa, không phải chân dung hay ảnh kỷ niệm.

## Chạy và xuất bản

Website tĩnh nằm trong `dist/`. Mở `dist/index.html` hoặc phục vụ thư mục `dist` bằng máy chủ tĩnh. Không cần npm hay bước build. Đưa các tệp trong `dist` vào một thư mục riêng trên GitHub Pages để có đường dẫn độc lập.

Trên GitHub, các tệp trong `dist/` được đặt trực tiếp trong thư mục `chuyen-chung-minh/`.

## Sử dụng

- Bấm Cảnh tiếp / Trở lại, chọn chương, cuộn nhẹ hoặc dùng phím trái/phải.
- Trên điện thoại, vuốt ngang trên hoạt cảnh để chuyển.
- Bấm Xem như phim để tự chuyển cảnh sau 14–16 giây. Phim dừng ở cảnh cuối; có thể xem lại từ đầu.
- Nhấn Space để bật/tạm dừng phim khi không đứng trên nút, Home / End để về đầu / cuối.
- Menu các chương hỗ trợ bàn phím. Tự chạy tạm dừng khi mở menu và khi tab bị ẩn.
- Tôn trọng cài đặt giảm chuyển động của thiết bị. Không tự chạy khi mới vào trang.

Lời kể nằm trong `dist/index.html`, chuyển cảnh trong `dist/story.js`, hình thức trong `dist/style.css`. Ảnh, phông chữ và biểu tượng đều tải từ cùng thư mục; không phụ thuộc CDN, không theo dõi người xem và không thu thập dữ liệu.

Tranh nền, hai nhân vật và tranh ôm nhau được tạo riêng cho website, sau đó mã hóa WebP để tải nhanh. Phông chữ Noto Serif và Open Sans được đóng gói cục bộ kèm giấy phép trong `dist/assets/FONT-LICENSES.txt`.
