const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
          username
        <input
          id="username"
          value={username}
          onChange={handleUsernameChange}
        />
      </div>
      <div>
          password
        <input
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <button type="submit"> login </button>
    </form>
  )
}

export default LoginForm