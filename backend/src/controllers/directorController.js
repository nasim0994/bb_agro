const Model = require("../models/directorModel");
const fs = require("fs");

exports.add = async (req, res) => {
  const file = req?.file?.filename;

  try {
    const data = req?.body;
    let newData = {
      ...data,
    };

    if (file) {
      newData = {
        ...data,
        image: `/director/${file}`,
      };
    }

    const result = await Model.create(newData);

    if (!result) {
      return res.json({
        success: false,
        message: "Something went wrong",
      });
    }

    res.status(201).json({
      success: true,
      message: "Director add success",
      data: result,
    });
  } catch (error) {
    fs.unlink(`./uploads/director/${file}`, (err) => {
      if (err) {
        console.log(err);
      }
    });
    res.json({
      success: false,
      message: error?.message,
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    const result = await Model.find({});

    res.status(200).json({
      success: true,
      message: "Director get success",
      data: result,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSingle = async (req, res) => {
  try {
    const id = req?.params?.id;
    const result = await Model.findById(id);
    if (!result) {
      return res.json({
        success: false,
        message: "Director not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Director get success",
      data: result,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

exports.update = async (req, res) => {
  const file = req?.file?.filename;

  try {
    const id = req?.params?.id;

    const isExist = await Model.findById(id);
    if (!isExist) {
      return res.json({
        success: false,
        message: "Director not found",
      });
    }

    const data = req.body;

    if (file) {
      await Model.findByIdAndUpdate(
        id,
        { ...data, image: `/director/${file}` },
        {
          new: true,
        }
      );

      fs.unlink(`./uploads/${isExist?.image}`, (err) => {
        if (err) {
          console.log(err);
        }
      });
    } else if (isExist?.image) {
      await Model.findByIdAndUpdate(
        id,
        { ...data, image: isExist?.image },
        {
          new: true,
        }
      );
    } else {
      await Model.findByIdAndUpdate(id, data, { new: true });
    }

    res.status(200).json({
      success: true,
      message: "Director updated success",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error?.message,
    });

    fs.unlink(`./uploads/director/${file}`, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
};

exports.destroy = async (req, res) => {
  try {
    const id = req?.params?.id;
    const isExist = await Model.findById(id);

    if (!isExist) {
      return res.json({
        success: false,
        message: "Director not found",
      });
    }

    if (isExist) {
      const result = await Model.findByIdAndDelete(id);

      if (result) {
        fs.unlink(`./uploads/${isExist?.image}`, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }

      res.status(200).json({
        success: true,
        message: "Delete success",
        data: result,
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: error?.message,
    });
  }
};
