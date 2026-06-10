const signUp = async (req, res) => {
  res.json({ data: "you are hititng the signup endpoint" });
};
const logIn = async (req, res) => {
  res.json({ data: "you are hititng the login endpoint" });
};
const logOut = async (req, res) => {
  res.json({ data: "you are hititng the logout endpoint" });
};


export {signUp,logIn, logOut}