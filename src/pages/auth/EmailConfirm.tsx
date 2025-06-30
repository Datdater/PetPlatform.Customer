import React, { useEffect, useState } from "react";

const EmailConfirm: React.FC = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    const token = params.get("token");

    if (!email || !token) {
      setStatus("error");
      setMessage("Thiếu thông tin xác nhận email.");
      return;
    }

    fetch(`/api/v1/auth/email-confirm?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (res.ok) {
          setStatus("success");
          setMessage("Xác nhận email thành công! Bạn có thể đăng nhập.");
        } else {
          const data = await res.json().catch(() => ({}));
          setStatus("error");
          setMessage(data.message || "Xác nhận email thất bại. Đường dẫn không hợp lệ hoặc đã hết hạn.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Có lỗi xảy ra khi xác nhận email. Vui lòng thử lại sau.");
      });
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      {status === "loading" && (
        <>
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4" />
          <div className="text-lg font-medium text-gray-700">Đang xác nhận email...</div>
        </>
      )}
      {status === "success" && (
        <>
          <div className="text-lg font-semibold text-green-700 mb-2">{message}</div>
          <a href="/login" className="text-primary font-medium hover:underline">Đăng nhập</a>
        </>
      )}
      {status === "error" && (
        <>
          <div className="text-3xl mb-2">❌</div>
          <div className="text-lg font-semibold text-red-600 mb-2">{message}</div>
        </>
      )}
    </div>
  );
};

export default EmailConfirm; 