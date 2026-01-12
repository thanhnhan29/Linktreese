import { test, expect } from '@playwright/test';

test('TC01: Đăng nhập thành công bằng Email/Password', async ({ page }) => {
  // 1. Truy cập trang
  await page.goto('http://localhost:3000/login');

  // 2. Điền thông tin (Playwright tự động focus nên không cần lệnh .click trước đó)
  await page.getByRole('textbox', { name: 'Email' }).fill('nguyenthanhkhoi123x321@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Ntkharry123@');

  // 3. Nhấn nút đăng nhập
  await page.getByRole('button', { name: 'Log in', exact: true }).click();

  // 4. QUAN TRỌNG: Kiểm tra kết quả (Assertion)
  // Hệ thống phải chuyển hướng sang trang Dashboard
  // Dấu .* nghĩa là chấp nhận mọi thứ phía trước (vd: http://localhost:3000/dashboard)
  await expect(page).toHaveURL(/.*dashboard/); 
  
  // Hoặc kiểm tra xem có hiện tên người dùng / nút Logout không để chắc chắn đã vào trong
  // await expect(page.getByText('Logout')).toBeVisible();
});