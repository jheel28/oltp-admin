import Footer from "components/footer/Footer";
import authImg from "assets/img/BETA-CLASSES Logo/BETA CLASSES 01 TRANSPARENT .-011 copy.jpg";
import { Link, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "views/auth/SignIn";
import RoleSelection from "views/auth/RoleSelection";
import StudentRegister from "views/auth/StudentRegister";
import AdminRegister from "views/auth/AdminRegister";
import FixedPlugin from "components/fixedPlugin/FixedPlugin";

export default function Auth() {
  document.documentElement.dir = "ltr";
  return (
    <div>
      <div className="relative float-right h-full min-h-screen w-full  dark:!bg-navy-900">
        <FixedPlugin />
        <main className={`mx-auto min-h-screen`}>
          <div className="relative flex">
            <div className="mx-auto flex min-h-full w-full flex-col justify-start pt-12 md:max-w-[75%] lg:h-screen lg:max-w-[1013px] lg:px-8 lg:pt-0 xl:h-[100vh] xl:max-w-[1383px] xl:px-0 xl:pl-[70px]">
              <div className="mb-auto flex flex-col pl-5 pr-5 md:pl-12 md:pr-0 lg:max-w-[48%] lg:pl-0 xl:max-w-full">
                <Routes>
                  <Route path="sign-in" element={<SignIn />} />
                  <Route path="admin-login" element={<SignIn />} />
                  <Route path="register" element={<RoleSelection />} />
                  <Route path="register/student" element={<StudentRegister />} />
                  <Route path="register/admin" element={<AdminRegister />} />
                  <Route
                    index
                    element={<Navigate to="/auth/sign-in" replace />}
                  />
                </Routes>
                <div className="absolute right-0 hidden h-full min-h-screen md:block lg:w-[49vw] 2xl:w-[44vw]">
                  <div className="absolute flex h-full w-full items-end justify-center bg-cover bg-center " />

                  <img
                    src={authImg}
                    style={{
                      marginTop: "70px",
                      paddingRight: "40px",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              </div>
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
