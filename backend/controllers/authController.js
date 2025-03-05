export const signup = async (req, res) => {
  try {
    res.send("SignUp Route Called");
  } catch (error) {
    console.log("Error in SignUp Route");
    res.status(500).send(`Error in SignUp`);
  }
};

export const login = async (req, res) => {
  try {
    res.send("Login Route Called");
  } catch (error) {
    console.log("Error in Login Route");
    res.status(500).send(`Error in Login`);
  }
};

export const logout = async (req, res) => {
  try {
    res.send("Logout Route Called");
  } catch (error) {
    console.log("Error in Logout Route");
    res.status(500).send(`Error in Logout`);
  }
};
 