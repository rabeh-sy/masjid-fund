export default function Footer() {
  return (
    <footer className="w-full bg-primary text-primary-foreground py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">مساجد سوريا</h3>
            <p className="text-sm opacity-90">
              منصة التبرعات للمساجد السورية - ادعم مساجد سوريا من خلال التبرعات والمشاريع الخيرية
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">المدن</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li>دمشق</li>
              <li>حلب</li>
              <li>حمص</li>
              <li>اللاذقية</li>
              <li>طرطوس</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">تواصل معنا</h4>
            <p className="text-sm opacity-90">
              للاستفسارات والمساعدة في إضافة مسجدكم إلى المنصة
            </p>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-sm opacity-75">
            جميع الحقوق محفوظة © 2025 منصة مساجد سوريا
          </p>
        </div>
      </div>
    </footer>
  );
}