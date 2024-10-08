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

## Login Functionality

### `Login` Component: Functional Explanation

The `Login` component allows users to authenticate by entering their username and password. It integrates with a custom hook (`useLogin`) to handle the login process. Here's a breakdown of the functionality:

#### 1. **State Management (`useState`)**

- **`username`**: This state variable holds the value of the username input field. It's updated when the user types into the username field.
- **`password`**: This state variable holds the value of the password input field and is similarly updated when the user types into the password field.

```js
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
```

#### 2. **Custom Hook (`useLogin`)**

- **`useLogin`**: This hook manages the login functionality, handling API requests and setting loading states.
- **`loading`**: This state is controlled by `useLogin` and indicates whether the login process is ongoing. It is used to disable the login button while waiting for the request to complete.
- **`login(username, password)`**: This function is called when the user submits the login form. It sends the username and password to the server for authentication.

```js
const { loading, login } = useLogin();
```

#### 3. **Form Submission (`handleSubmit`)**

The form's `onSubmit` handler prevents the default form submission behavior and calls the `login` function from `useLogin`, passing in the `username` and `password` state values.

```js
const handleSubmit = async (e) => {
  e.preventDefault();
  await login(username, password);
};
```

#### 4. **Input Fields for Username and Password**

- **Username Input**:
  - A controlled input field for the username.
  - The `value` is bound to the `username` state, and any changes to the input update this state.
  
  ```js
  <input
    type="text"
    placeholder="Enter username"
    className="w-full input input-bordered h-10"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
  />
  ```

- **Password Input**:
  - A controlled input field for the password, with similar functionality to the username input.
  
  ```js
  <input
    type="password"
    placeholder="Enter Password"
    className="w-full input input-bordered h-10"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  ```

#### 5. **Link to Signup Page**

- A `Link` component from `react-router-dom` is used to navigate to the signup page if the user doesn't have an account. This allows for client-side navigation without refreshing the page.

```js
<Link
  to="/signup"
  className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block"
>
  {"Don't"} have an account?
</Link>
```

#### 6. **Login Button**

- The login button is disabled when the `loading` state is `true` (i.e., during the login process). If loading, a spinner is shown. Otherwise, the button displays "Login".
- The `loading` state prevents multiple submissions while the request is in progress.

```js
<button className="btn btn-block btn-sm mt-2" disabled={loading}>
  {loading ? (
    <span className="loading loading-spinner"></span>
  ) : (
    "Login"
  )}
</button>
```

### Key Takeaways

- **State Management**: Controlled inputs are used for the username and password fields, allowing React to manage the form data.
- **Custom Hook Integration**: The `useLogin` hook is used to abstract the login logic, keeping the component focused on handling user inputs and UI logic.
- **Loading State**: The login button shows a spinner and is disabled when the login request is in progress, providing feedback to the user.
- **Routing**: A `Link` component is provided to direct users to the signup page if they don't have an account. This improves navigation without causing a full-page reload.

### useLogin hook

### `useLogin` Hook: Functional Explanation

The `useLogin` hook handles the user login process by managing form validation, sending a login request to the server, updating the global authentication state, and providing feedback to the user. Here's a detailed breakdown:

#### 1. **State Management (`useState`)**

- **`loading`**:
  - The `loading` state tracks whether the login process is in progress. This state is set to `true` when the login request starts and is reset to `false` when the process finishes (whether successful or not).
  
  ```js
  const [loading, setLoading] = useState(false);
  ```

#### 2. **Context (`useAuthContext`)**

- **`useAuthContext`**:
  - The hook retrieves the `setAuthUser` function from the `AuthContext`. This function is used to update the globally stored authenticated user upon a successful login.

  ```js
  const { setAuthUser } = useAuthContext();
  ```

#### 3. **`login` Function**

##### a. **Input Validation**

- Before proceeding with the login request, the `handleInputErrors` function is called to check if the username and password fields are filled.
- If either field is empty, it shows an error message using `react-hot-toast` and returns early.

  ```js
  const success = handleInputErrors(username, password);
  if (!success) return;
  ```

##### b. **Starting the Login Request**

- The `loading` state is set to `true` to indicate that the login process has started.

  ```js
  setLoading(true);
  ```

##### c. **Making the Login Request**

- A `POST` request is sent to the `/api/auth/login` endpoint with the `username` and `password` as the request body.
  
  ```js
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  ```

##### d. **Handling the Response**

- The response is parsed into JSON format. If the response contains an error (e.g., incorrect credentials), the error is thrown and caught by the `catch` block, where an error message is shown using `toast`.

  ```js
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  ```

##### e. **Successful Login**

- If the login is successful:
  - The user data returned by the API is stored in `localStorage` using the key `chat-user`. This allows the app to persist the logged-in user across browser sessions.
  - The `setAuthUser` function is called to update the global authentication state with the user data.

  ```js
  localStorage.setItem("chat-user", JSON.stringify(data));
  setAuthUser(data);
  ```

##### f. **Error Handling**

- If an error occurs during the login request (e.g., network issues, invalid credentials), it is caught by the `catch` block, and an error toast is displayed to the user.

  ```js
  catch (error) {
    toast.error(error.message);
  }
  ```

##### g. **Resetting Loading State**

- Whether the login is successful or an error occurs, the `finally` block ensures that the `loading` state is reset to `false`, allowing the UI to stop showing any loading indicators.

  ```js
  finally {
    setLoading(false);
  }
  ```

#### 4. **Handling Input Errors (`handleInputErrors`)**

- The `handleInputErrors` function checks if both `username` and `password` fields are filled. If not, it displays a `toast` error and returns `false` to indicate validation failure.
  
  ```js
  function handleInputErrors(username, password) {
    if (!username || !password) {
      toast.error("Please fill in all fields");
      return false;
    }
    return true;
  }
  ```

#### 5. **Returning Values**

The `useLogin` hook returns the following values:

- **`loading`**: Boolean value indicating whether the login request is in progress.
- **`login(username, password)`**: The function that executes the login process when called.

```js
return { loading, login };
```

### Key Takeaways

- **Loading State**: A `loading` state ensures that the login button or other UI elements can react to the login process (e.g., disabling the login button while waiting for a response).
- **Error Handling**: If there are issues with login (empty fields or server errors), the `toast` notifications provide immediate feedback to the user.
- **Auth Context Integration**: The hook updates the global authentication state with the logged-in user's data, making it available across the app.
- **Local Storage**: The user information is persisted in `localStorage`, allowing the user to remain logged in even if the page is refreshed.

### Example Usage

```js
import useLogin from './path-to-useLogin';

const LoginPage = () => {
  const { login, loading } = useLogin();
  const handleLogin = async () => {
    await login('exampleUsername', 'examplePassword');
  };
  
  return (
    <button onClick={handleLogin} disabled={loading}>
      {loading ? 'Logging in...' : 'Login'}
    </button>
  );
};
```

## Get Conversations for sidebar

- `npm install zustand`

### useConversation zustad

Your `useConversation` store setup with Zustand looks great! This store allows you to manage the state of the selected conversation and its messages in a clean and simple way. Here’s a quick breakdown and potential improvements:

### Explanation

- **`selectedConversation`:** This state holds the currently selected conversation (probably an object or `null` if no conversation is selected).
- **`setSelectedConversation`:** A function to update the selected conversation.
- **`messages`:** This state holds the array of messages for the selected conversation.
- **`setMessages`:** A function to update the messages array.

### Potential Improvements

1. **Add Message Update Functions:**
   You may want to add helper functions for handling common actions like adding a new message to the conversation or clearing messages.

   Example:

   ```js
   import { create } from "zustand";

   const useConversation = create((set) => ({
     selectedConversation: null,
     setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
     messages: [],
     setMessages: (messages) => set({ messages }),
     addMessage: (newMessage) =>
       set((state) => ({ messages: [...state.messages, newMessage] })),
     clearMessages: () => set({ messages: [] }),
   }));

   export default useConversation;
   ```

   - **`addMessage(newMessage)`:** Adds a new message to the existing array of messages.
   - **`clearMessages()`:** Clears all messages from the store, useful when switching conversations or logging out.

2. **Persistent Conversations (Optional)**:
   If you want to keep the conversation state persistent (e.g., after a page reload), you could integrate Zustand with local storage using a middleware.

   Example with persistence:

   ```js
   import { create } from "zustand";
   import { persist } from "zustand/middleware";

   const useConversation = create(
     persist(
       (set) => ({
         selectedConversation: null,
         setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
         messages: [],
         setMessages: (messages) => set({ messages }),
         addMessage: (newMessage) =>
           set((state) => ({ messages: [...state.messages, newMessage] })),
         clearMessages: () => set({ messages: [] }),
       }),
       {
         name: "conversation-storage", // Name of the storage (key)
       }
     )
   );

   export default useConversation;
   ```

   This way, the state of the `selectedConversation` and `messages` will persist across reloads by storing them in `localStorage`.

This approach makes your Zustand store more feature-complete and robust for managing conversation states in your chat application!

### useGetConversations hook

Your `useGetConversations` hook looks well-structured! It efficiently fetches conversation data from the API and handles loading and errors. Here are some improvements and suggestions you could consider:

### Improvements

1. **Error Handling with Status Codes:**
   Instead of relying only on `data.error`, you can handle HTTP status codes explicitly to ensure better error detection.

   Example:

   ```js
   const res = await fetch("/api/users");
   if (!res.ok) {
     throw new Error(`Error: ${res.statusText}`);
   }
   ```

2. **Abort Controller (For Cleanup):**
   It's good practice to add an abort controller to avoid memory leaks, especially when a component unmounts while the request is still pending.

   Example:

   ```js
   useEffect(() => {
     const controller = new AbortController();
     const getConversations = async () => {
       setLoading(true);
       try {
         const res = await fetch("/api/users", { signal: controller.signal });
         if (!res.ok) {
           throw new Error(`Error: ${res.statusText}`);
         }
         const data = await res.json();
         setConversations(data);
       } catch (error) {
         if (error.name !== "AbortError") {
           toast.error(error.message);
         }
       } finally {
         setLoading(false);
       }
     };

     getConversations();

     return () => {
       controller.abort();
     };
   }, []);
   ```

   This ensures that if the component unmounts, the request is aborted, preventing potential errors or unnecessary state updates.

3. **Add a Retry Mechanism (Optional):**
   You can add a retry mechanism to re-fetch conversations if it fails, using a counter to limit the retries.

   Example:

   ```js
   const getConversations = async (retryCount = 3) => {
     setLoading(true);
     try {
       const res = await fetch("/api/users");
       if (!res.ok) {
         throw new Error(`Error: ${res.statusText}`);
       }
       const data = await res.json();
       setConversations(data);
     } catch (error) {
       if (retryCount > 0) {
         getConversations(retryCount - 1); // Retry
       } else {
         toast.error("Failed to fetch conversations after multiple attempts.");
       }
     } finally {
       setLoading(false);
     }
   };
   ```

### Final Code with Improvements

```js
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const getConversations = async (retryCount = 3) => {
      setLoading(true);
      try {
        const res = await fetch("/api/users", { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`Error: ${res.statusText}`);
        }
        const data = await res.json();
        setConversations(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          if (retryCount > 0) {
            getConversations(retryCount - 1); // Retry on failure
          } else {
            toast.error("Failed to fetch conversations after multiple attempts.");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    getConversations();

    return () => {
      controller.abort(); // Cleanup on unmount
    };
  }, []);

  return { loading, conversations };
};

export default useGetConversations;
```

With these adjustments, your hook is more robust, handling aborts, retries, and HTTP errors more efficiently.

## SelectedConversation

The `MessageContainer` component manages and displays either the selected conversation's messages or a welcome prompt if no conversation is selected. Here's a breakdown of the functional aspects:

### `useEffect` Hook

- **Purpose**: This ensures that when the `MessageContainer` is unmounted (when the user navigates away or closes the chat), the selected conversation is reset by calling `setSelectedConversation(null)`. This helps in clearing the state when no conversation is selected anymore.
- **Dependency Array**: `setSelectedConversation` is included, so the cleanup function runs when the component unmounts.

### Conditional Rendering

- The component checks if `selectedConversation` exists. If it's not selected (`null`), it renders the `NoChatSelected` component, which prompts the user to select a chat.
- If a conversation is selected, it renders the conversation details, message history (`Messages`), and an input field (`MessageInput`) for sending new messages.

### `NoChatSelected` Component

- The `NoChatSelected` component gets the authenticated user (`authUser`) from the `AuthContext` and shows a welcome message for the user. It's shown when no conversation is selected, inviting the user to start a chat.

### `Messages` and `MessageInput`

- These components handle displaying the chat history and input for sending messages, respectively, once a conversation is active.

In summary, the functional part of the `MessageContainer` revolves around handling the selected conversation and cleaning up when necessary, while managing state through Zustand and displaying relevant content accordingly.

## useSendMessage hook

The `useSendMessage` hook is responsible for handling the process of sending a message in the chat and updating the conversation state with the newly sent message. Here's how the functional aspects work:

### State Management

- **`loading`**: A state variable that tracks whether the message is being sent. It's set to `true` before the fetch request and to `false` once the request is complete, ensuring the UI can react to this loading state (e.g., by disabling inputs).
  
### Zustand Integration

- **`useConversation`**: This hook extracts `messages`, `setMessages`, and `selectedConversation` from the Zustand store. It helps manage the conversation state across components.
  - `messages`: Holds the current conversation's messages.
  - `setMessages`: Updates the conversation's message list when a new message is sent.
  - `selectedConversation`: The currently active conversation, used to send messages to the correct user.

### `sendMessage` Function

- **Purpose**: Sends a message to the server for the currently selected conversation.
  - **Fetch Request**:
    - Sends a `POST` request to the backend at `/api/messages/send/{selectedConversation._id}` with the message content.
    - The message is serialized as JSON and included in the request body.
  - **Error Handling**: If the response contains an error, it's caught and a toast notification is triggered.
  - **Success Handling**: Upon successful response, the newly sent message (from the server) is appended to the existing messages array using `setMessages([...messages, data])`, ensuring the UI reflects the update.

### Return Values

- **`sendMessage`**: The main function to send the message.
- **`loading`**: The state flag that can be used to display loading indicators or disable the message input during the send operation.

This hook simplifies message-sending logic and keeps the conversation state synchronized across the app.

## useGetMessages hook

Here’s an explanation of the `useGetMessages` hook, which is responsible for fetching messages in a conversation using Zustand state management and React hooks:

---

### `useGetMessages` Hook

This custom React hook fetches messages for a selected conversation and manages the loading state using Zustand for state management. It integrates a toast notification for error handling and dynamically fetches messages when the conversation changes.

#### 1. **State Management**

- The hook uses `useState` to manage the loading state (`loading`), which indicates whether the messages are being fetched.
- `useConversation` is a Zustand store hook that manages the `messages`, `setMessages`, and `selectedConversation` states. This store centralizes state management for conversations across the app.

#### 2. **Fetching Messages with `useEffect`**

- `useEffect` is used to trigger the fetching process whenever the `selectedConversation._id` changes. This ensures that whenever a different conversation is selected, the corresponding messages are fetched from the server.
- The `getMessages` function inside the effect makes a fetch request to the `/api/messages/:conversationId` endpoint to retrieve messages for the currently selected conversation.

#### 3. **Handling the Fetching Process**

- **Loading State**: `setLoading(true)` is called before the fetch request to indicate that the loading process has started. After the fetch completes (whether successful or not), `setLoading(false)` is called in the `finally` block to reset the loading state.
- **Error Handling**: If an error occurs (e.g., if the API responds with an error), the `catch` block captures it and displays an error message using `toast.error`.
- **Data Handling**: If the fetch is successful, the messages are updated in the Zustand store (`setMessages(data)`), allowing the rest of the app to access the fetched messages.

#### 4. **Conditional Fetching**

- The fetch operation is only initiated if `selectedConversation._id` exists, ensuring that the function doesn't try to fetch messages before a conversation is selected.

#### 5. **Return Values**

- The hook returns the `messages` (from the Zustand store) and the `loading` state, which can be used by components to display a loading indicator or show the fetched messages.

---

This hook centralizes message-fetching logic, ensuring that whenever a user switches conversations, the relevant messages are fetched and displayed. Zustand is used for efficient state management, and error notifications are handled using `react-hot-toast` for a better user experience.

## Messages.jsx

Here’s an explanation of the `Messages` component, which is responsible for rendering and managing the list of messages in a chat application:

---

### `Messages` Component

This component renders a list of messages between two users, displays skeleton loaders while the messages are being fetched, and ensures smooth scrolling to the latest message.

#### 1. **Fetching Messages**

- The hook `useGetMessages` is called to fetch the messages and manage the loading state. It returns `messages` (the fetched list of messages) and `loading` (a boolean indicating whether the messages are being loaded).
- `useListenMessages` is likely another hook that listens for real-time updates (like new messages) and ensures the messages stay updated.

#### 2. **Smooth Scrolling to the Latest Message**

- A `useRef` hook (`lastMessageRef`) is used to reference the last message in the list, ensuring that the UI scrolls smoothly to the most recent message.
- `useEffect` is triggered whenever the `messages` array changes. It sets a timeout of 100ms to allow the messages to load, and then calls `scrollIntoView()` on the last message, ensuring smooth scrolling to the latest message.

#### 3. **Rendering Messages**

- If the messages have loaded (`!loading`), the component maps over the `messages` array and renders a `Message` component for each message.
- Each message container has a `ref={lastMessageRef}`, ensuring the component can scroll to the last message.

#### 4. **Skeleton Loader and Empty State**

- While the messages are being loaded (`loading`), the component renders `MessageSkeleton` components, simulating the loading state.
- If there are no messages after loading, the component shows a prompt, `"Send a message to start the conversation"`, indicating that the conversation has no messages yet.

#### 5. **Return Structure**

- The component wraps everything in a scrollable `div` (`overflow-auto`), ensuring that users can scroll through the message history.
- The structure dynamically handles the three main states: loading, rendering messages, or showing an empty conversation.

---

This component manages message rendering efficiently, providing feedback through skeleton loaders while messages are being fetched, and smoothly scrolls to the latest message when new messages arrive. It also handles real-time updates via `useListenMessages`, ensuring a responsive chat experience.

## Search Input

Here’s an explanation of the `SearchInput` component, which is designed to search for a user in a list of conversations:

---

### `SearchInput` Component

This component provides a search functionality to find a user within existing conversations. It uses state management, input handling, and error feedback for user interaction.

#### 1. **State Management**

- `useState` is used to manage the `search` term, which captures the user's input in the search bar.
- `useConversation` is a Zustand hook that allows access to `setSelectedConversation`, a function to update the currently selected conversation.
- `useGetConversations` fetches the list of conversations that the user has participated in, returning `conversations`, which contains all the relevant data to search from.

#### 2. **Handling Search Submission**

- The `handleSubmit` function handles the search form submission.
- **Validation**:
  - If the search term is empty, the function does nothing (`return`).
  - If the search term is shorter than 3 characters, an error toast (`toast.error`) is shown, instructing the user that the search term must be at least 3 characters long.
- **Search Logic**:
  - The function searches through the `conversations` array, using `find()` to match any conversation where the participant's `fullName` includes the search term (case-insensitive).
  - If a match is found, the `setSelectedConversation` function is called with the matched conversation to update the selected conversation in the state, and the search input is cleared (`setSearch("")`).
  - If no match is found, an error toast is displayed with the message `"No such user found!"`.

#### 3. **Rendering the Input and Button**

- The form contains:
  - A `text` input field where the user types the search term. The value of the input is bound to `search`, and the `onChange` handler updates the search state on every keystroke.
  - A submit button, styled as a circular button with a magnifying glass icon (`IoSearchSharp`), which triggers the search process when clicked.

#### 4. **Return Structure**

- The `form` element wraps the input and button, with an `onSubmit` handler attached to trigger the search functionality.
- Tailwind CSS classes like `input`, `input-bordered`, `rounded-full`, `btn`, and `bg-sky-500` are used to style the form and button, making the input field rounded and giving the button a sky-blue background.

---

This component allows users to search for a conversation by the participant's name and select the conversation when a match is found. It provides validation and user feedback through toast notifications for both short search terms and unsuccessful searches.

## SocketContext

-`npm i socket.io-client`

Here’s an explanation of the `SocketContext` and its provider to help document it:

---

### **Socket Context for Real-Time Communication**

This component uses Socket.IO to manage real-time communication and online user tracking within your chat application. It ensures that the app can detect when users are online and listen to real-time events from the server.

#### 1. **Creating the Context**

- **`SocketContext`**:
  - This context allows any component in the app to access the WebSocket connection and the list of online users.
- **`useSocketContext`**:
  - This hook simplifies access to the `SocketContext`, providing an easy way to get the socket instance and online users.

#### 2. **SocketContextProvider**

- This provider component establishes and manages the WebSocket connection. It ensures that the WebSocket connection is only active when the user is authenticated and tears it down when the user logs out.

#### 3. **WebSocket Connection with Socket.IO**

- **Establishing the Connection**:
  - When the authenticated user (`authUser`) is available, a WebSocket connection is established to `https://chat-app-yt.onrender.com`.
  - **Query Parameter**: The `userId` is passed in the connection query to identify the user on the server.
  - **Setting Socket Instance**: The created `socket` instance is stored in state for further communication and listening to events.

- **Listening for Online Users**:
  - **`getOnlineUsers` Event**:
    - The client listens to the `"getOnlineUsers"` event emitted by the server. The event provides the list of currently online users, which is updated in the `onlineUsers` state.

- **Cleaning Up the Socket**:
  - When the user logs out or the component unmounts, the WebSocket connection is closed, preventing memory leaks or unwanted connections.
  - If the user is no longer authenticated, the `socket` is reset to `null`, and the WebSocket connection is terminated.

#### 4. **Returning Context Provider**

- The `SocketContext.Provider` makes the socket instance and the `onlineUsers` array available to all child components. This ensures that any component needing to interact with the WebSocket or display the online users can easily access these values.

---

### **Usage:**

- Components needing access to the WebSocket or online users can use `useSocketContext()`. For example, to check online users or emit real-time events, a component can simply call:

   ```js
   const { socket, onlineUsers } = useSocketContext();
   ```

This setup efficiently manages WebSocket connections based on the user’s authentication state, ensuring proper real-time communication and user tracking across the app.

## useListenMessages hook

The `useListenMessages` hook is used to handle real-time message reception and notification in your chat application. Here's how it works, and how you can document it:

---

### **useListenMessages Hook**

This custom React hook listens for new incoming messages via WebSocket (Socket.IO) and manages their integration into the conversation. It also triggers a notification sound whenever a new message is received.

#### 1. **Dependencies**

- **`useSocketContext`**:
  - The hook uses the WebSocket connection from the `SocketContext` to listen for real-time events.
- **`useConversation`**:
  - This Zustand store manages the state of the current conversation and its messages, which is updated when new messages are received.
- **`notificationSound`**:
  - A preloaded sound (`notification.mp3`) that is played when a new message arrives.

#### 2. **Listening for New Messages**

- **Socket Event - `newMessage`**:
  - The hook listens for the `"newMessage"` event on the `socket`. Whenever this event is emitted by the server (indicating a new message), the message is received in the client.
  - **Message Handling**:
    - The new message object (`newMessage`) is marked with a property `shouldShake: true` to enable visual indication that the message is new and has not been read yet.

#### 3. **Playing Notification Sound**

- A sound notification is triggered using the `Audio` API. The sound plays every time a new message is received, ensuring the user is alerted to incoming messages even if they’re not actively viewing the conversation.

#### 4. **Updating Messages in the Conversation**

- **Updating State**:
  - The hook adds the newly received message to the current conversation by spreading the previous `messages` state and appending the `newMessage` to it.
  - **State Consistency**: It leverages the `setMessages` function from the conversation store to ensure the state is properly updated.

#### 5. **Cleaning Up Event Listener**

- **Socket Cleanup**:
  - When the component using this hook unmounts or the WebSocket disconnects, the `socket.off("newMessage")` function is called to remove the listener. This prevents memory leaks and multiple event bindings.

#### 6. **Effect Dependencies**

- The effect is re-triggered if the `socket`, `messages`, or `setMessages` change, ensuring the hook remains in sync with the state and WebSocket connection.

---

### **Usage:**

- This hook can be used in any chat-related component that needs to listen for real-time message updates. It plays a notification sound and appends new messages to the existing conversation.

Example usage in a component:

```js
useListenMessages(); // Starts listening for new messages
```

This ensures that users receive real-time notifications and their conversation state is always updated when a new message arrives.
