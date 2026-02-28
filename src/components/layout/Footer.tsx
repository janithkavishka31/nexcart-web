export function Footer() {
  return (
    <footer className="border-t border-slate-200 py-10 dark:border-slate-800">
      <div className="container-page flex flex-col justify-between gap-4 text-sm text-slate-500 dark:text-slate-400 md:flex-row">
        <p>&copy; {new Date().getFullYear()} NexCart. All rights reserved.</p>
        <p>Online shopping for customers and sellers.</p>
      </div>
    </footer>
  );
}
