import { Suspense, lazy } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import LoadingSpinner from "../components/LoadingSpinner"; // Assuming this path is correct

const StudentServicesPage = lazy(() => import("./StudentServicesPage"));
const InstituteServicesPage = lazy(() => import("./InstituteServicesPage"));

const onBack = () => {
  window.history.back();
};

const ServicesPage = () => {
  const { userType } = useContext(AppContext);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {userType === "institute" ? (
        <InstituteServicesPage onBack={onBack} />
      ) : (
        <StudentServicesPage onBack={onBack} />
      )}
    </Suspense>
  );
};

export default ServicesPage;
