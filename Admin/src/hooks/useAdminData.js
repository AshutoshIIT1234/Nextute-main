import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const useAdminData = () => {
  const [adminData, setAdminData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasRenderedOnce, setHasRenderedOnce] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      try {
        const [institutesRes, studentsRes, jobsRes, reviewsRes, teamRes] = await Promise.all([
          fetch(`${API_URL}/api/institutes/all-institutes`),
          fetch(`${API_URL}/api/students/all`),
          fetch(`${API_URL}/api/jobs/all`),
          fetch(`${API_URL}/api/feedback/reviews`),
          fetch(`${API_URL}/api/employees/members`)
        ]);

        const [institutes, students, jobs, reviews, team] = await Promise.all([
          institutesRes.json(),
          studentsRes.json(),
          jobsRes.json(),
          reviewsRes.json(),
          teamRes.json()
        ]);

        const getArray = (resp, key = "data") => Array.isArray(resp) ? resp : (Array.isArray(resp?.[key]) ? resp[key] : []);
        setAdminData({
          totalInstitutes: getArray(institutes).length,
          totalStudents: getArray(students, "students").length,
          institutes: getArray(institutes),
          students: getArray(students, "students"),
          jobs: Array.isArray(jobs) ? jobs : (Array.isArray(jobs?.data) ? jobs.data : []),
          reviews: getArray(reviews),
          team: getArray(team),
        });
        setHasRenderedOnce(true);
        setError(null);
      } catch (err) {
        setError("Failed to fetch admin data");
        setAdminData(null);
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, []);

  return { adminData, dataLoading, error, hasRenderedOnce };
};

export default useAdminData;