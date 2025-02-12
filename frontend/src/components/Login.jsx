import { useState } from "react";

function Login(props) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	function handleLogin(e) {
		e.preventDefault();
		fetch("http://localhost:3000/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username: username, password: password }),
		})
			.then(function (res) {
				return res.json();
			})
			.then(function (data) {
				if (data.token) {
					localStorage.setItem("token", data.token);
					props.setToken(data.token);
				} else {
					alert("Login failed");
				}
			})
			.catch(function (error) {
				console.error("Login error:", error);
			});
	}

	return (
		<form onSubmit={handleLogin}>
			<input
				type="text"
				placeholder="Username"
				value={username}
				onChange={function (e) {
					setUsername(e.target.value);
				}}
			/>
			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={function (e) {
					setPassword(e.target.value);
				}}
			/>
			<button type="submit">Login</button>
		</form>
	);
}

export { Login };
