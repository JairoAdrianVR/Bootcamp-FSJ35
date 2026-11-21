import { LoginForm } from "@/features/auth";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium text-muted-foreground">Panel de administración</p>
          <h1 className="mt-2 font-display text-4xl tracking-tight">Acceso restringido</h1>
        </div>
        <div className="rounded-2xl border border-border bg-background p-8 shadow-sm">
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Solo personal autorizado.
        </p>
      </div>
    </div>
  );
}