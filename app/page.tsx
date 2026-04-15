import Link from 'next/link';

export default function Home() {
  return (
    <section className="flex min-h-full items-center px-6 py-10 md:px-10">
      <div className="max-w-3xl">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-[0.3em]">
          Portfolio workspace
        </p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-balance md:text-6xl">
          Theo dõi tài sản của bạn từ một sidebar gọn và rõ ràng.
        </h2>
        <p className="text-muted-foreground mt-5 max-w-2xl text-base leading-7 md:text-lg">
          Chọn một danh mục ở bên trái để chuyển nhanh giữa Vàng và Chứng chỉ quỹ. Mỗi mục đã có
          route riêng để bạn tiếp tục mở rộng dashboard chi tiết sau này.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/gold"
            className="rounded-full bg-[#17120d] px-5 py-3 text-sm font-medium text-[#f6d28d] transition hover:bg-[#2b2318]"
          >
            Mở mục Vàng
          </Link>
          <Link
            href="/fund-certificates"
            className="rounded-full border border-border bg-white/80 px-5 py-3 text-sm font-medium transition hover:bg-white"
          >
            Xem Chứng chỉ quỹ
          </Link>
        </div>
      </div>
    </section>
  );
}
