"use strict";

class Learnjs {

  constructor() {
    this.problems = [
      { description: "What is Thruth?", code: "function problem() { return ___; }"},
      { description: "Simple Math", code: "function problem() { return 42 === 6 * ___; }"}
    ]
  }

  /**
   * Routing function
   * @param {string} hash hash part of URL
   */
  showView(hash) {
    // do the binding here instead of e.g. in the constructor, otherwise spying on the individal methods will not work
    // in the jasmine tests
    const routes = Object.create(null);
    routes["#problem"] = this.problemView.bind(this);

    learnjs.triggerEvent("removingView", []);
    if (typeof hash === "string") {
      const hashParts = hash.split("-");
      if (hashParts.length === 2) {
        const problemNumber = parseInt(hashParts[1], 10);
        const viewFn = routes[hashParts[0]];
        if (viewFn && Number.isFinite(problemNumber) && problemNumber >= 1 && problemNumber <= this.problems.length) {
          $(".view-container").empty().append(viewFn(problemNumber));
          return;
        }
      }
    }
    // default to landing page
    $(".view-container").empty().append(this.landingView());
  }

  /**
   * Clones the landing page HTML template and returns it
   */
  landingView() {
    return this.template("landing-view");
  }

  /**
   * Clones and populates the problem view HTML template and returns it
   */
  problemView(problemNumber) {
    const view = this.template("problem-view");
    const problemData = this.problems[problemNumber - 1];
    const resultFlash = view.find(".result");

    if (problemNumber < this.problems.length) {
      const buttonItem = this.template("skip-btn");
      buttonItem.find("a").attr("href", "#problem-" + (problemNumber + 1).toString(10));
      $(".nav-list").append(buttonItem);
      view.bind("removingView", () => {
        buttonItem.remove();
      });
    }

    const checkAnswer = () => {
      const answer = view.find(".answer").val();
      const test = problemData.code.replace("___", answer) + "; problem();";
      return eval(test);
    };

    const checkAnswerClick = () => {
      if (checkAnswer()) {
        const correctFlash = this.template("correct-flash");
        correctFlash.find("a").attr("href", "#problem-" + (problemNumber + 1).toString(10));
        this.flashElement(resultFlash, correctFlash);
      } else {
        this.flashElement(resultFlash, "Incorrect!");
      }
      return false;
    }

    view.find(".check-btn").click(checkAnswerClick)
    view.find(".title").text("Problem #" + problemNumber);
    this.applyObject(problemData, view);
    return view;
  }

  buildCorrectFlash(problemNumber) {
    const correctFlash = this.template("correct-flash");
    const link = correctFlash.find("a");
    if (problemNumber < this.problems.length) {
      link.attr("href", "#problem-" + (problemNumber + 1).toString(10));
    } else {
      link.attr("href", "");
      link.text("You're Finished!");
    }
  }

  /**
   * Entry point
   */
  appOnReady() {
    this.showView(window.location.hash);
    window.onhashchange = () => this.appOnHashChange();
  }

  /**
   * window.onhashchange event handler; initiates routing
   */
  appOnHashChange() {
    this.showView(window.location.hash);
  }

  applyObject(obj, elem) {
    for (const key in obj) {
      elem.find("[data-name=\"" + key + "\"]").text(obj[key]);
    }
  }

  flashElement(elem, content) {
    elem.fadeOut("fast", () => {
      elem.html(content);
      elem.fadeIn();
    });
  }

  template(name) {
    return $(".templates ." + name).clone();
  }

  triggerEvent(name, args) {
    $(".view-container>*").trigger(name, args);
  }
}

const learnjs = new Learnjs();
