# My-Chat

- `npm create vite@latest .`
- `npm install -D tailwindcss postcss autoprefixer npx tailwindcss init -p`
- `npm i -D daisyui@latest`
- `npm i react-router-dom`
- `npm install react-hot-toast`

## SignUp

### SignUp Component: Functional Explanation

The `SignUp` component is a user registration form built in React that interacts with a signup hook (`useSignup`). This component handles user input, form submission, and basic validation logic, while the `useSignup` hook handles the communication with the backend (assumed to be for creating a new user).

#### 1. **Component Initialization**

- **State Management (`useState`)**:
  - The component manages form inputs using the `useState` hook. An object called `inputs` holds the values for:
    - `fullName`: Full name of the user.
    - `username`: Username of the user.
    - `password`: User's password.
    - `confirmPassword`: User's confirmation of the password.
    - `gender`: User's selected gender (managed by a child component `GenderCheckbox`).

  ```js
  const [inputs, setInputs] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  ```

- **Custom Hook (`useSignup`)**:
  - The `useSignup` hook returns two values:
    - `loading`: A boolean indicating whether the signup process is currently in progress.
    - `signup`: A function to execute the signup process.
  
  ```js
  const { loading, signup } = useSignup();
  ```

#### 2. **Event Handlers**

- **handleCheckboxChange**:
  - This function is passed to the child component (`GenderCheckbox`) to handle gender selection. When a checkbox is clicked, the gender value is updated in the `inputs` state.
  
  ```js
  const handleCheckboxChange = (gender) => {
    setInputs({ ...inputs, gender });
  };
  ```

- **handleSubmit**:
  - This function is triggered when the form is submitted. It prevents the default form behavior (`e.preventDefault()`), then invokes the `signup` function with the current `inputs` state.
  
  ```js
  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(inputs);
  };
  ```

#### 3. **Input Fields**

- **Full Name, Username, Password, Confirm Password**:
  - Each of these fields is bound to the `inputs` state using two-way data binding. When the user types into these fields, the corresponding state (`inputs`) is updated via `onChange` handlers.
  - Example for the "Full Name" field:
  
  ```js
  <input
    type="text"
    placeholder="John Doe"
    value={inputs.fullName}
    onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
  />
  ```

#### 4. **Gender Selection: `GenderCheckbox` Component**

- The `GenderCheckbox` is a separate component that handles gender selection. It takes two props:
  - `onCheckboxChange`: The `handleCheckboxChange` function passed down to update the `gender` value in the `inputs` state.
  - `selectedGender`: The currently selected gender from the `inputs` state.

  ```jsx
  <GenderCheckbox
    onCheckboxChange={handleCheckboxChange}
    selectedGender={inputs.gender}
  />
  ```

#### 5. **Submit Button**

- The "Sign Up" button:
  - It triggers the `handleSubmit` function upon form submission.
  - The button is disabled while the `loading` state is `true`, which prevents multiple submissions while a request is in progress.
  - If `loading` is `true`, a loading spinner is shown; otherwise, the "Sign Up" text is displayed.
  
  ```jsx
  <button
    className="btn btn-block btn-sm mt-2"
    disabled={loading}
  >
    {loading ? <span className="loading loading-spinner"></span> : "Sign Up"}
  </button>
  ```

#### 6. **Login Redirect Link**

- A link is provided to redirect users who already have an account to the login page (`/login`).

  ```jsx
  <Link to={"/login"}>
    Already have an account?
  </Link>
  ```

#### 7. **Overall Workflow**

1. **User Interaction**:
   - The user fills in their full name, username, password, and confirms the password.
   - The user selects their gender using the `GenderCheckbox`.

2. **Form Submission**:
   - On form submission, the `signup` function is triggered with all input values passed in as the `inputs` object.
   - The component is locked (via the `loading` state) while the request is in progress to avoid duplicate requests.

3. **Backend Integration**:
   - The `signup` function (presumably from the `useSignup` hook) would communicate with a backend to create the new user.

### Key Takeaways

- This `SignUp` component is designed to handle user registration, leveraging a custom signup hook to manage asynchronous behavior.
- It uses state to capture form inputs and gender selection, with each input field being fully controlled.
- The `loading` state ensures a smooth user experience by showing a loading spinner and preventing multiple form submissions during the signup process.

## UseSignup Hook

### `useSignup` Hook: Functional Explanation

The `useSignup` hook is responsible for managing the signup logic in your React application. This includes form validation, managing loading state, handling server communication (via `fetch`), and providing user feedback using `react-hot-toast`.

#### 1. **State Management (`useState`)**

- **`loading`**:
  - The hook manages a `loading` state to track whether a signup request is currently in progress. It helps to disable the form and show a spinner while the signup process is being handled.
  
  ```js
  const [loading, setLoading] = useState(false);
  ```

#### 2. **Signup Function (`signup`)**

The `signup` function is the core of the signup process. It takes an object containing `fullName`, `username`, `password`, `confirmPassword`, and `gender` as input and performs the following tasks:

##### a. **Input Validation: `handleInputErrors`**

- The function first validates the input fields by calling `handleInputErrors`. This function checks if:
  - All required fields are filled.
  - The `password` matches the `confirmPassword`.
  - The `password` meets the minimum length requirement (6 characters).
  
- If any validation fails, an error toast is shown, and the function returns early, preventing the signup request from being sent to the server.

  ```js
  const success = handleInputErrors({
    fullName,
    username,
    password,
    confirmPassword,
    gender,
  });
  if (!success) return;
  ```

##### b. **API Request: Sending the Signup Data**

- If validation is successful, the function proceeds to make an asynchronous API request to the signup endpoint (`/api/auth/signup`). This is done using the `fetch` API:
  - The request is sent as a POST request with `application/json` headers.
  - The form data (`fullName`, `username`, `password`, `confirmPassword`, `gender`) is sent as the request body.
  
  ```js
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fullName,
      username,
      password,
      confirmPassword,
      gender,
    }),
  });
  ```

##### c. **Response Handling**

- Once the API responds, the function:
  - Parses the JSON response.
  - If the response contains an error (e.g., `data.error`), it throws an error and triggers the `catch` block to display an error message using `toast.error()`.
  
  ```js
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  ```

##### d. **Error Handling**

- If the API request fails (due to network errors or API errors), the `catch` block catches the error and shows a toast message with the error details.

  ```js
  catch (error) {
    toast.error(error.message);
  }
  ```

##### e. **Loading State Management**

- The `loading` state is set to `true` when the API request is initiated and set back to `false` once the request is finished (either successfully or with an error).
  
  ```js
  setLoading(true);
  ...
  setLoading(false);
  ```

#### 3. **Helper Function: `handleInputErrors`**

This function performs basic form validation before submitting the signup request.

- **Field Presence**: Checks if all fields (`fullName`, `username`, `password`, `confirmPassword`, and `gender`) are filled in. If any field is missing, it shows an error toast and returns `false`.
  
  ```js
  if (!fullName || !username || !password || !confirmPassword || !gender) {
    toast.error("Please fill in all fields");
    return false;
  }
  ```

- **Password Matching**: Ensures that the `password` and `confirmPassword` fields match. If they don't, it shows an error toast and returns `false`.
  
  ```js
  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return false;
  }
  ```

- **Password Length**: Ensures that the `password` is at least 6 characters long. If not, it shows an error toast and returns `false`.
  
  ```js
  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return false;
  }
  ```

- **Return Success**: If all checks pass, the function returns `true`, allowing the signup request to proceed.

  ```js
  return true;
  ```

#### 4. **Return Values**

The hook returns two values:

- **`loading`**: Boolean value that indicates whether the signup process is in progress.
- **`signup`**: Function that performs the signup process, validating inputs and sending the signup request to the server.

```js
return { loading, signup };
```

### Key Takeaways1

- **Input Validation**: Ensures that all fields are filled and passwords meet the criteria before sending a signup request.
- **Loading State**: Provides a `loading` state to prevent multiple submissions and improve user experience.
- **Error Handling**: Uses `try-catch` to handle errors and displays meaningful messages using `react-hot-toast`.
- **API Interaction**: Sends the signup data to a backend endpoint (`/api/auth/signup`) and handles the response appropriately.

## AuthUserContext

### `AuthContext` Implementation: Functional Explanation

The `AuthContext` is a React context that provides authentication-related state and functionality across your application. It wraps its children components and makes the current authenticated user (`authUser`) and a function to update the user (`setAuthUser`) accessible to any child component via the context.

#### 1. **Context Creation (`createContext`)**

- **`AuthContext`**:
  - The `AuthContext` is created using the `createContext()` function from React. This context will hold the authentication state (`authUser`) and provide a mechanism to update that state (`setAuthUser`).
  
  ```js
  export const AuthContext = createContext();
  ```

#### 2. **Custom Hook (`useAuthContext`)**

- **`useAuthContext`**:
  - This custom hook simplifies accessing the authentication context in any child component. By using this hook, you avoid repeating `useContext(AuthContext)` throughout your components.
  
  ```js
  export const useAuthContext = () => {
    return useContext(AuthContext);
  };
  ```

  - **Usage Example**: In a component where you want to access the authenticated user:
  
    ```js
    const { authUser, setAuthUser } = useAuthContext();
    ```

#### 3. **State Management in `AuthContextProvider`**

The `AuthContextProvider` is a higher-order component that wraps the application or part of it to provide authentication state globally. Here's how it works:

##### a. **State Initialization**

- The `authUser` state is initialized using the `useState` hook.
- The initial value of `authUser` is retrieved from `localStorage`:
  - If a user is already logged in and their data is stored in `localStorage` under the key `"chat-user"`, it is parsed into a JavaScript object and set as the initial state.
  - If no user data is present in `localStorage`, the initial state is `null`.
  
  ```js
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("chat-user")) || null
  );
  ```

##### b. **Providing the Context Value**

- The `AuthContext.Provider` component wraps its children and provides the current `authUser` state and the `setAuthUser` function as the context value.
- This allows any component within the `AuthContextProvider`'s tree to access and modify the authenticated user state.

  ```js
  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
  ```

##### c. **Children Prop**

- The `children` prop refers to all components nested within the `AuthContextProvider`. By wrapping your app or parts of your app with `AuthContextProvider`, the authentication state becomes accessible to those components.

  ```js
  export const AuthContextProvider = ({ children }) => {
    // auth state logic
    return <AuthContext.Provider>{children}</AuthContext.Provider>;
  };
  ```

#### 4. **Usage Example**

To use the `AuthContextProvider`, wrap your root component or a section of your app:

```js
import { AuthContextProvider } from './path-to-auth-context-file';

function App() {
  return (
    <AuthContextProvider>
      {/* other components that need access to authUser */}
    </AuthContextProvider>
  );
}
```

Now, inside any component that requires authentication context, you can access it like this:

```js
import { useAuthContext } from './path-to-auth-context-file';

function UserProfile() {
  const { authUser, setAuthUser } = useAuthContext();

  return <div>{authUser ? `Welcome, ${authUser.username}` : 'Please log in'}</div>;
}
```

### Key Takeaways2

- **Global Authentication State**: The `AuthContextProvider` component provides a global way to manage and share the `authUser` state across different parts of your application.
- **State Persistence**: The initial `authUser` state is hydrated from `localStorage`, allowing user authentication data to persist between page reloads.
- **Custom Hook (`useAuthContext`)**: This custom hook simplifies access to the authentication context, making it easy to retrieve or update the user's authentication state from any component.

## useLogout hook

### `useLogout` Hook: Functional Explanation

The `useLogout` hook provides the functionality for logging out a user. It handles the logout process, including interacting with an API, updating the authentication state, and managing the loading state while the request is processed. Here's a detailed breakdown:

#### 1. **State Management (`useState`)1**

- **`loading`**:
  - A `loading` state is used to track whether the logout process is in progress. It ensures that the UI can respond (e.g., disable buttons or show loading spinners) during the logout process.
  
  ```js
  const [loading, setLoading] = useState(false);
  ```

#### 2. **Context Access (`useAuthContext`)**

- The hook makes use of the `useAuthContext` to access the `setAuthUser` function, which allows it to clear the authenticated user from the global authentication state upon successful logout.
  
  ```js
  const { setAuthUser } = useAuthContext();
  ```

#### 3. **Logout Function (`logout`)**

##### a. **Setting the Loading State**

- Before initiating the logout request, `setLoading(true)` is called to indicate that the process has started.
  
  ```js
  setLoading(true);
  ```

##### b. **API Request: Logging Out**

- The `logout` function makes a POST request to the `/api/auth/logout` endpoint. This request tells the server to log out the current user session.

  ```js
  const res = await fetch("/api/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  ```

##### c. **Response Handling1**

- Once the server responds, the result is parsed as JSON. If the server returns an error (indicated by `data.error`), the function throws an error, which is caught in the `catch` block.

  ```js
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  ```

##### d. **Clearing Local Storage and Updating Context**

- If the logout request is successful:
  - The `chat-user` item is removed from `localStorage` to clear any persisted user data on the client side.
  - The global authentication state is updated by calling `setAuthUser(null)`, effectively logging the user out across the application.

  ```js
  localStorage.removeItem("chat-user");
  setAuthUser(null);
  ```

##### e. **Error Handling**

- If the API request fails or the server returns an error, the `catch` block catches the error, and a toast notification is shown with the error message.
  
  ```js
  catch (error) {
    toast.error(error.message);
  }
  ```

##### f. **Resetting the Loading State**

- Whether the request succeeds or fails, the `finally` block ensures that the `loading` state is reset to `false`, signaling that the logout process is complete.

  ```js
  finally {
    setLoading(false);
  }
  ```

#### 4. **Return Values1**

The `useLogout` hook returns two values:

- **`loading`**: Boolean that indicates whether the logout process is in progress. This can be used to disable UI elements (like buttons) during the process.
- **`logout`**: The function that executes the logout process.

```js
return { loading, logout };
```

### Usage Example

To use this hook in a component, simply call `useLogout` and invoke the `logout` function when needed. For example:

```js
import useLogout from './path-to-useLogout';

const LogoutButton = () => {
  const { loading, logout } = useLogout();

  return (
    <button onClick={logout} disabled={loading}>
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  );
};
```

### Key Takeaways3

- **Loading State**: The hook manages a `loading` state to prevent multiple logout requests and to provide visual feedback to the user during the process.
- **Context Update**: It clears the global authentication state (`authUser`) and local storage to ensure the user is logged out both on the client and server sides.
- **Error Handling**: If the server returns an error during logout, it provides user feedback using `react-hot-toast`.
