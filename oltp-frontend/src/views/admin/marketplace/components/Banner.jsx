import Logo from "assets/img/Logo/correct.png";
import { IoSchool } from "react-icons/io5";

const Banner1 = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-500 to-purple-600 px-8 py-7 text-white shadow-lg shadow-brand-500/30">
      <div className="absolute -right-8 -top-8 h-44 w-44 rounded-full bg-white/10" />
      <div className="absolute -bottom-12 right-24 h-36 w-36 rounded-full bg-white/5" />
      <div className="absolute bottom-0 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-purple-400/20" />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <IoSchool className="h-4 w-4 text-white/70" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
              Admin Panel
            </span>
          </div>
          <h2 className="text-3xl font-bold leading-tight">
            The Correct Steps
          </h2>
          <p className="mt-1.5 max-w-sm text-sm text-white/70">
            Online Learning & Assessment Platform — manage students, tests, and results from one place.
          </p>
        </div>

        <div className="hidden shrink-0 md:flex h-[96px] w-[96px] items-center justify-center rounded-2xl bg-white/20 p-3 shadow-xl backdrop-blur-sm ring-1 ring-white/30">
          <img
            src={Logo}
            alt="The Correct Steps"
            className="h-full w-full object-contain"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        </div>
      </div>
    </div>
  );
};

export default Banner1;