import { test, expect } from '@playwright/test';

test('TC02: Đăng nhập thất bại do sai mật khẩu', async ({ page }) => {
  // 1. Vào trang login
  await page.goto('http://localhost:3000/login');

  // 2. Điền email & Pass sai (đã xóa các bước click thừa)
  await page.getByRole('textbox', { name: 'Email' }).fill('nguyenthanhkhoi123x321@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('sfdgfsdgsdfg');

  // 3. Click nút đăng nhập
  await page.getByRole('button', { name: 'Log in', exact: true }).click();

  // 4. KIỂM TRA (ASSERTION)
  // Đây là dòng quan trọng nhất: Chờ dòng chữ lỗi xuất hiện
  // .first() dùng để lấy cái thông báo đầu tiên tìm thấy (tránh lỗi nếu web render 2 thông báo ẩn)
  await expect(page.getByText('Incorrect email or password').first()).toBeVisible();
});