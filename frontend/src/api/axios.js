import axios from "axios";

let updateAccessToken = null;

export const setAccessTokenUpdater = (callback) => {
    updateAccessToken = callback;
};

// Production
// const api = axios.create({
//     baseURL: 'https://studio-banana.onrender.com/api/',
// });

// Local
// const api = axios.create({
//     baseURL: 'http://localhost:8000/api/',
// });

// port
// const api = axios.create({
//     baseURL: 'https://d19fhgxx-8000.inc1.devtunnels.ms/api/',
// });
console.log("My current Vite API URL is:", import.meta.env.VITE_API_URL);

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

let isRefreshing = false;
let refreshPromise = null;


api.interceptors.request.use((config) => {
    // const token = localStorage.getItem('token');
    const accessToken = localStorage.getItem('accessToken')
    console.log( "Access token:", accessToken ? "YES" : "NO");
    // const isPublicRequest =
    //     (config.method?.toLowerCase() === "get" && config.url?.includes("/products/")) ||
    //     config.url?.includes("/auth/") ||
    //     config.url?.includes("/token/refresh/");

    const isAuthRoute = config.url?.includes("/auth/") || config.url?.includes("/token/refresh/");

    if(accessToken && !isAuthRoute) {
        // config.headers.Authorization = `Token ${token}`
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
    },
    (error) => Promise.reject(error)
)   


// for handle token expiry
// api.interceptors.response.use(
//     (response) => response,
//     (error) => {

//          // 1. Check if the failed request was sent to the login endpoint
//         const isLoginRequest = error.config?.url?.includes('auth/');

//         // 2. Only redirect if it's a 401 error AND NOT a login request
//         if (error.response && error.response.status === 401 && !isLoginRequest) {
//             localStorage.removeItem('token');
//             localStorage.removeItem('accessToken');

//             window.location.href = '/auth'; 
//         }
        
//         // Always reject the error so your component's catch block can handle it
//         return Promise.reject(error);
//     }
// );


// Handle expired access token
api.interceptors.response.use(
    (response) => response,
    async (error) => {

        const originalRequest = error.config;

        const isLoginRequest = originalRequest?.url?.includes('auth/'); // Django URL

        const isRefreshRequest = originalRequest?.url?.includes('token/refresh/') // Django URL

        // Check if this was a public read request to the products catalog
        const userType = localStorage.getItem('user_type');
        const isPublicProductGet = userType !== 'admin' && originalRequest.method?.toLowerCase() === 'get' && originalRequest?.url?.includes('/products/');
        // const isRecommendationsGet = originalRequest?.url?.includes('/recommendations/') && originalRequest.method === 'get';

        // Public product requests should never trigger JWT refresh/logout
        if (isPublicProductGet) {
            return Promise.reject(error);
        }

        // if access token expired
        if ( error.response?.status === 401 &&
            !isLoginRequest && 
            !isRefreshRequest && 
            !originalRequest._retry
        ) {
            

            originalRequest._retry = true; // for to retry original request only once 

            const refreshToken = localStorage.getItem('refreshToken');

            // No refresh token then logout.
            if(!refreshToken) {
                logoutUser()
                return Promise.reject(error)
            }

            // try {
                
            //     const res = await axios.post('http://localhost:8000/api/token/refresh/', {
            //         refresh : refreshToken,
            //     })

            //     const newAccessToken = res.data.access;

            //     localStorage.setItem('accessToken', newAccessToken)

            //     // update failed request
            //     originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            //     // retry original request
            //     return api(originalRequest)

            // } catch (refreshError) {
            //     logoutUser()
            //     return Promise.reject(refreshError);
            // }
            try {

                if (!isRefreshing) {

                    isRefreshing = true;


                    refreshPromise = api.post("token/refresh/", {
                        refresh : refreshToken,
                    })
                    .then((response) => {

                        const newAccessToken = response.data.access;
                        // console.log('refresh token posted success');
                        // console.log("Retrying original request:", originalRequest.url);
                        // console.log(response.data);
                        localStorage.setItem( "accessToken", newAccessToken );

                        if (updateAccessToken) {
                            updateAccessToken(newAccessToken);
                        }
                        // console.log('token refreshed');

                        return newAccessToken;
                    })
                    .finally(() => {
                        isRefreshing = false;
                        refreshPromise = null;
                    });
                }


                // Wait for the refresh request
                const newAccessToken = await refreshPromise;


                // Update failed request
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;


                // Retry original request
                return api(originalRequest);


            } catch (refreshError) {

                logoutUser();

                return Promise.reject(refreshError);
            }

        }

        return Promise.reject(error);
    }
);



const logoutUser = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user_type");
    localStorage.removeItem("user");

    window.location.href = "/auth";
};

// or repeat this everywhere , too much code
// axios.get(url, {
//   headers: {
//     Authorization: `Token ${localStorage.getItem('token')}`
//   }
// })

export default api;