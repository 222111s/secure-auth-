exports.dashboard = (req, res) => {
  res.json({ message: `Welcome to the dashboard, ${req.user.name}!`, role: req.user.role });
};

exports.adminPage = (req, res) => {
  res.json({ message: 'Welcome Admin! You have full system access.' });
};

exports.managerPage = (req, res) => {
  res.json({ message: 'Welcome Manager! You can manage your team.' });
};

exports.profilePage = (req, res) => {
  res.json({ message: `Welcome ${req.user.name}! This is your profile.`, role: req.user.role });
};