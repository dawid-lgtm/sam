import { Lock, Mail } from "lucide-react";
import { Image } from "@/components/ui/image";
import { BRAND_MARK } from "@/lib/brand";

function EmailShell({ inbox, subject, children }) {
  return (
    <div className="mx-auto w-full max-w-[380px] overflow-hidden rounded-2xl border border-foreground/20 bg-card shadow-xl">
      <div className="space-y-0.5 border-b border-foreground/15 bg-background/60 px-3 py-2">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{inbox}</p>
        <p className="text-[11px] text-muted-foreground">From: Sam &lt;no-reply&gt; · to you</p>
        <p className="text-[14px] font-semibold">{subject}</p>
      </div>
      {children}
    </div>
  );
}

function WelcomeEmail({ firstName, role }) {
  return (
    <EmailShell inbox="Inbox" subject="Welcome to Sam">
      <div className="flex items-baseline justify-between bg-gold px-4 py-2.5">
        <span className="font-heading text-[19px] font-semibold text-gold-foreground">Sam</span>
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gold-foreground">
          Mine-In-A-Box
        </span>
      </div>
      <div className="space-y-2.5 bg-background px-4 py-3">
        <div>
          <p className="font-heading text-[19px] font-semibold leading-tight">Welcome, {firstName}.</p>
          <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
            MMS has elected to deploy the Decision Architecture Managing Strategy Module. You have been invited to
            Sam, the platform that will deploy this program in MMS. Your role has been set to that of Administrator.
          </p>
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gold">What you need to do next</p>
          <p className="mt-1 text-[11px] leading-snug">
            <b>1. Set your password.</b> Use the button below, then sign in with the password you set. This link is
            yours alone.
          </p>
          <p className="mt-1.5 inline-block rounded-lg bg-gold px-3 py-1.5 text-[11px] font-bold text-gold-foreground">
            Set your password
          </p>
        </div>
        <div>
          <p className="font-heading text-[11px] font-semibold leading-snug text-gold">
            Your login will take you to the administrator page. Once there, complete the following steps:
          </p>
          <p className="mt-1 text-[11px] leading-snug">
            <b>1. Load your people.</b> Add the details and roles of the people who will complete the program. Each
            person you add receives their own welcome email.
          </p>
          <p className="mt-1 text-[11px] leading-snug">
            <b>2. Launch the program.</b> Use the Launch the program link. Sam walks you through the steps in order.
          </p>
          <p className="mt-1 text-[11px] leading-snug">
            You will also find the deployment methodology explained step by step, a section with the tools and
            artifacts, and the reporting dashboards. The dashboards are empty for now and fill as the program
            progresses.
          </p>
        </div>
        <p className="rounded-lg bg-card px-2.5 py-2 text-[11px] leading-snug">
          Sam is invite only. If you did not expect this email, you can ignore it and nothing will happen to your
          account.
        </p>
        <div className="text-[10px] leading-snug text-muted-foreground">
          <p className="font-heading text-[13px] font-semibold text-foreground">Sam</p>
          <p>Mine-In-A-Box™ · Powered by Raptortech</p>
          <p className="mt-1">Your role is being set to {role}.</p>
        </div>
      </div>
    </EmailShell>
  );
}

function AuthPhone({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="mx-auto w-full max-w-[360px] rounded-[26px] border border-foreground/20 bg-background p-3 shadow-xl">
      <div className="rounded-2xl bg-card p-4">
        <div className="text-center">
          <span className="mx-auto block h-10 w-10 overflow-hidden rounded-full bg-gold p-[2px]">
            <Image src={BRAND_MARK} alt="Sam" className="h-full w-full rounded-full" />
          </span>
          <p className="mt-1.5 font-heading text-[24px] font-semibold leading-none">Sam</p>
          <p className="text-[11px] font-semibold text-gold">Mine-In-A-Box™</p>
          <p className="mt-2 flex items-center justify-center gap-1.5 font-heading text-[16px] font-semibold">
            <Icon className="h-4 w-4 text-gold" /> {title}
          </p>
          <p className="text-[11px] text-muted-foreground">{subtitle}</p>
        </div>
        <div className="mt-3 space-y-2">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, placeholder, plain }) {
  return (
    <div>
      <p className="text-[11px] font-medium">{label}</p>
      <p className="mt-0.5 rounded-lg border border-input bg-background px-2.5 py-1.5 text-[12px] text-muted-foreground">
        {placeholder}
        {plain ? "" : ""}
      </p>
    </div>
  );
}

export function authScreens(person) {
  const firstName = person.name;
  const email = `${person.name.toLowerCase()}@kestrel.com.au`;
  return [
    {
      group: "Getting in",
      title: `The welcome email he gets`,
      where: "Email inbox",
      does: `${firstName} is invited by an administrator. The email is the only way in: Sam has no sign-up. It tells him to set a password, then sign in.`,
      view: <WelcomeEmail firstName={firstName} role={person.role} />,
    },
    {
      group: "Getting in",
      title: "He sets his password",
      where: "Set password page",
      does: `The button in the email opens this page with his own single-use token. He picks a password and is sent to the sign-in screen.`,
      view: (
        <AuthPhone icon={Lock} title="New password" subtitle="Enter your new password below">
          <Field label="New password" placeholder="••••••••" />
          <Field label="Confirm password" placeholder="••••••••" />
          <p className="rounded-lg bg-gold py-1.5 text-center text-[12px] font-semibold text-gold-foreground">
            Reset password
          </p>
          <p className="text-center text-[10px] text-muted-foreground">Mine-In-A-Box™ · Powered by Raptortech</p>
        </AuthPhone>
      ),
    },
    {
      group: "Getting in",
      title: "He signs in",
      where: "Sign in page",
      does: `This is the only way into the app: email and password, nothing else. Signing in takes him straight to Home, which is the next screen.`,
      view: (
        <AuthPhone icon={Lock} title="Sign in" subtitle="Leadership programs for mine sites">
          <Field label="Email" placeholder={email} />
          <div>
            <p className="flex items-center justify-between text-[11px] font-medium">
              Password <span className="text-gold">Forgot password?</span>
            </p>
            <p className="mt-0.5 flex items-center gap-1 rounded-lg border border-input bg-background px-2.5 py-1.5 text-[12px] text-muted-foreground">
              <Mail className="h-3 w-3" /> ••••••••
            </p>
          </div>
          <p className="rounded-lg bg-gold py-2 text-center text-[12px] font-bold text-gold-foreground">Log in</p>
          <p className="text-center text-[10px] text-muted-foreground">
            Invite only. Ask your site Project Manager for access.
          </p>
        </AuthPhone>
      ),
    },
  ];
}