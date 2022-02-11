const express = require("express");
const Router = express.Router();
const CheckListModel = require("../models/CheckList");

// Landing To the Add Page
Router.get("/add", async (request, response) => {
  try {
    response.render("addchecklist");
  } catch (error) {
    console.log(error);
    response.status(500).render("errors/500", {
      layout: "errors/500",
    });
  }
});
// Making A CheckList Page
Router.post("/add", async (request, response) => {
  try {
    const NewCheckList = await CheckListModel({
      user: request.body.user,
      email: request.body.email,
      progress: request.body.progress,
      note: request.body.note,
    });
    await NewCheckList.save();
    console.log(request.body);
    request.flash(
      "success_msg",
      "Thanks For the checklist...please check your list on the dashboard"
    );
    response.redirect("/checklist/add");
  } catch (error) {
    response.status(500);
    request.flash("error", "There was an error making your checklist");
    response.redirect("/checklist/add");
  }
});
// Landing To The View Page
Router.get("/list", async (request, response) => {
  try {
    const queryParams = request.query;
    const LimitNumber = queryParams.paginationLimit || 3;
    const CurrentPage = queryParams.CurrentPage || 1;
    const skipCount = CurrentPage * (LimitNumber - 1);
    const CheckList = await CheckListModel.find().limit(LimitNumber);
    response.render("showlist", {
      CheckList,
      paginationLimit: LimitNumber,
      CurrentPage,
    });
  } catch (error) {
    console.log(error);
    response.status(500).render("errors/500", {
      layout: "errors/500",
    });
  }
});
// Landing To The View Page
Router.get("/list", async (request, response) => {
  try {
    const queryParams = request.query;
    const LimitNumber = queryParams.paginationLimit || 4;
    const currentPage = queryParams.currentPage || 1;
    const skipCount = currentPage * (LimitNumber - 1);
    const CheckList = await CheckListModel.find().limit(LimitNumber).skip(skipCount)
    response.render("showlist", {
     CheckList,
      paginationLimit: LimitNumber,
      currentPage,
    });
  } catch (error) {
    console.log(error);
    response.status(500).render("errors/500", {
      layout: "errors/500",
    });
  }
});
// Router To A Single Checklist Info
Router.get("/:ID", async (request, response) => {
  try {
    const SingleCheckList = await CheckListModel.findOne({
      _id: request.params.ID,
    });
    if (!SingleCheckList) {
      response.status(500).render("errors/500", {
        layout: "errors/500",
      });
    }
    response.render("single", {
      SingleCheckList,
    });
  } catch (error) {
    console.log(error);
    response.status(500).render("errors/500", {
      layout: "errors/500",
    });
  }
});
// Deleting A SingleChecklist Info
Router.post("/drop/:ID", async (request, response) => {
  try {
    await CheckListModel.findOneAndRemove({ _id: request.params.ID });
    request.flash("success_msg", "You dropped a checklist");
    response.redirect("/checklist/list");
  } catch (error) {
    console.log(error);
    response.status(500).render("errors/500", {
      layout: "errors/500",
    });
  }
});
// Editing A SingleChecklist
Router.get("/edit/:id", async (request, response) => {
  try {
    response.render("editlist");
  } catch (error) {
    console.log(error);
    response.status(500).render("errors/500", {
      layout: "errors/500",
    });
  }
});

module.exports = Router;

                        <!-- <button class="text-center" data-paginationLimit="<%=paginationLimit%>" data-="">Load More >>></button> -->