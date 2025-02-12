import { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Login(props) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	function handleLogin(e) {
		e.preventDefault();
		console.log(
			"Login clicked. Username:",
			username,
			"Password:",
			password
		);
		fetch(`${API_URL}/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password }),
		})
			.then((res) => {
				console.log("Received response:", res);
				return res.json();
			})
			.then((data) => {
				console.log("Data received:", data);
				if (data.token) {
					localStorage.setItem("token", data.token);
					props.setToken(data.token);
				} else {
					alert("Login failed");
				}
			})
			.catch((error) => {
				console.error("Login error:", error);
			});
	}

	return (
		<form onSubmit={handleLogin}>
			<input
				type="text"
				placeholder="Username"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
			/>
			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<button type="submit">Login</button>
		</form>
	);
}

export { Login };
