const AssignedTask = require("../model/AssignedTask");
const { StudentModel } = require("../model/Student.model");
const { TaskModel } = require("../model/Task.model");
const TeacherModel = require("../model/Teacher.model");
const bcrypt = require("bcryptjs");

// to register teacher
exports.teacherSignup = async (req, res) => {
  try {
    const newUser = await TeacherModel(req.body);
    await newUser.save();
    res.status(200).send({
      msg: "SignUp Success",
    });
  } catch (error) {
    res.status(501).send({ msg: error.message });
  }
};

// to login teacher
exports.TeacherLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const getuserData = await TeacherModel.findOne({ email }).select(
      "+password"
    );
    if (getuserData && getuserData.email) {
      const result = await bcrypt.compare(password, getuserData.password);
      const geneRatedToken = await getuserData.jwtToken();
      if (result) {
        res.status(200).send({
          msg: "User login Successfully",
          token: geneRatedToken,
          role: getuserData.role,
        });
      } else {
        res.status(404).send({ msg: "Wrong Password,Please try again!" });
      }
    } else {
      res
        .status(404)
        .send({ msg: "No Account Found Associated with this email" });
    }
  } catch (error) {
    res.status(501).send({ msg: error.message });
  }
};

// create a task

exports.createTask = async (req, res) => {
  const userid = req.body.userid || "";
  try {
    const newTask = await TaskModel({ ...req.body, createdBy: userid });
    await newTask.save();
    res.status(200).send({ msg: "Task Create Successfully" });
  } catch (error) {
    res.status(501).send({ msg: error.message });
  }
};

// assignTask

exports.assignTask = async (req, res) => {
  const { taskId, userid, studentid } = req.body || {};
  if (!taskId || !userid || !studentid) {
    return res.status(404).send({ msg: "All Input fields are required" });
  }

  try {
    const assignedTask = await AssignedTask({
      task: taskId,
      assignedBy: userid,
      assignedTo: studentid,
    });
    await assignedTask.save();
    res
      .status(200)
      .send({ msg: "Task Assigned Successfully", createdTask: assignedTask });
  } catch (error) {
    res.status(500).send({ msg: error.message });
  }
};

// get all task which is assigned by Teacher

exports.taskCreatedByTeacher = async (req, res) => {
  const teacherid = req.body?.userid;
  const taskType = req.query?.submit || false;
  console.log(teacherid);
  try {
    const data = await AssignedTask.find({
      assignedBy: teacherid,
      evalStatus: taskType,
    }).populate("assignedBy assignedTo task");
    res.status(200).send({ msg: "Task Fetched Successfully", data });
  } catch (error) {
    res.status(501).send({ message: error.message });
  }
};

// @GET get assinged task by id

exports.getAssignedTaskById = async (req, res) => {
  const _id = req.params?.id;
  try {
    const data = await AssignedTask.findOne({ _id }).populate(
      "assignedBy assignedTo task"
    );
    res.status(200).send({ msg: "Data Successfully Fetchted", data });
  } catch (error) {
    res.status(501).send({ message: error.message });
  }
};

// get dashboard info

exports.teacherDashboardDetails = async (req, res) => {
  const userId = req.body.userid;
  try {
    const completedTask = await AssignedTask.find({
      assignedBy: userId,
      evalStatus: true,
    }).populate("assignedBy task assignedTo");
    const pendingforReviewTask = await AssignedTask.find({
      assignedBy: userId,
      evalStatus: false,
    }).populate("assignedBy task assignedTo");
    res.status(200).send({
      message: "Data Successfully Fetched",
      countofCompletedTask: completedTask.length,
      countofPendingTask: pendingforReviewTask.length,
      completedTask: completedTask,
      pendingTask: pendingforReviewTask,
    });
  } catch (error) {}
};
