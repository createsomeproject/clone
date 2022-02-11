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
// Landing To The View Page Json
Router.get("/list", async (request, response) => {
  try {
    const queryParams = request.query;
    const limitNumber = queryParams.limitNumber || 4;
    const pagenumber = queryParams.pagenumber || 1;
    const startcount = (pagenumber - 1) * limitNumber;
    const CheckList = await CheckListModel.find()
      .limit(limitNumber)
      .skip(startcount);
    response.render("showlist", {
      CheckList,
      limitNumber,
      pagenumber,
    });
  } catch (error) {
    console.log(error);
    response.status(500).render("errors/500", {
      layout: "errors/500",
    });
  }
});
// Router To A Single Checklist Info
Router.get("/view/:ID", async (request, response) => {
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
Router.post('/drop/:ID', async (request,response) => {
try {
    await CheckListModel.findOneAndRemove({ _id : request.params.ID })
    request.flash("success_msg",'You dropped a checklist');
    response.redirect('/checklist/list')
} catch (error) {
      console.log(error);
      response.status(500).render("errors/500", {
        layout: "errors/500",
      });
}
})
// Open A SingleChecklist Edit pAGE
Router.get('/edit/:id', async (request,response) => {
try {
    const ChecklistID = request.params.id;
    const CheckListItem = await CheckListModel.findById(ChecklistID);
    response.render("editlist",{
      CheckListItem
    });
} catch (error) {
     console.log(error);
      response.status(500).render("errors/500", {
        layout: "errors/500",
      });
}
})

// Editing A SingleChecklist
Router.post('/update/:id', async (request,response) => {
try {
    const ChecklistID = request.params.id;
    await CheckListModel.findOneAndUpdate({_id : ChecklistID},request.body,{
      new:true,
      runValidators : true
    })
      request.flash("success_msg", "You edited a checklist");
    response.redirect("/checklist/edit/" + ChecklistID);
} catch (error) {
     console.log(error);
      response.status(500).render("errors/500", {
        layout: "errors/500",
      });
}
})
// JSON format
Router.get('/loadmore', async (request,response) => {
 try {
    const limitNumber = request.query.limitNumber || 4
    const pagenumber = request.query.pagenumber || 1
    const skipcount = (pagenumber - 1) * limitNumber
    const loadmoredata = await CheckListModel.find().limit(limitNumber).skip(skipcount);
    response.json({
      data: loadmoredata,
      pagenumber: pagenumber,
      limitNumber: limitNumber,
    });
 } catch (error) {
   console.log(error)
 }
})
module.exports = Router;
