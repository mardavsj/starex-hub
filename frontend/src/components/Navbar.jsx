import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Palette, User, Gamepad2 } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="bg-base-100 fixed w-full top-0 z-40">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="hidden size-9 rounded-lg bg-primary/10 md:flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary"/>
              </div>
              <h1 className="md:text-lg text-base font-bold">StarX</h1>
            </Link>
          </div>

          <div className="flex items-center md:gap-2 gap-1.5">
            <Link to={"/games"} className={`btn btn-sm gap-2 transition-colors bg-primary/20 hover:bg-primary/30 border border-transparent hover:border-primary`}>
              <Gamepad2 className="size-4" />
              <span className="hidden sm:inline">Games</span>
            </Link>

            <Link to={"/settings"} className={`btn btn-sm gap-2 transition-colors bg-primary/20 hover:bg-primary/30 border border-transparent hover:border-primary`}>
              <Palette className="size-4" />
              <span className="hidden sm:inline">Themes</span>
            </Link>

            {!authUser && (
              <Link to={"/login"} className={`btn btn-sm gap-2 transition-colors bg-primary/20 hover:bg-primary/30 border border-transparent hover:border-primary`}>
                <User className="size-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}

            {authUser && (
              <>
                <Link to={"/chat"} className={`btn btn-sm gap-2 bg-primary/20 hover:bg-primary/30 border border-transparent hover:border-primary `}>
                  <MessageSquare className="size-4" />
                  <span className="hidden sm:inline">My Chats</span>
                </Link>

                <Link to={"/profile"} className={`btn btn-sm gap-2 bg-primary/20 hover:bg-primary/30 border border-transparent hover:border-primary`}>
                  <User className="size-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center text-red-500 bg-red-500/15 hover:bg-red-500/25 btn btn-sm border border-transparent shadow-none hover:border-red-500" onClick={logout}>
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;