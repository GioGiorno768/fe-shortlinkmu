import AuthBranding from "@/components/auth/AuthBranding";
import AuthFormWrapper from "@/components/auth/AuthFormWrapper";
import LoginForm from "@/components/auth/LoginForm";
import AuthPageCheck from "@/components/auth/AuthPageCheck";

export default function LoginPage() {
  return (
    <AuthPageCheck>
      <main className="h-screen overflow-hidden grid grid-cols-1 lg:grid-cols-2 font-figtree">
        <AuthBranding
          title="Mulai Perjalanan<br />Anda di Sini."
          subtitle="Daftar gratis untuk mulai mengubah link panjang menjadi link pendek yang menguntungkan."
          accentColor="blue"
        />
        <AuthFormWrapper allowScroll>
          <LoginForm />
        </AuthFormWrapper>
      </main>
    </AuthPageCheck>
  );
}
