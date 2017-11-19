describe("LearnJS", () => {
	it("can show a problem view", () => {
		learnjs.showView("#problem-1");
		expect($(".view-container .problem-view").length).toEqual(1);
	});
	it("shows the landing page when there is no hash", () => {
		learnjs.showView("");
		expect($(".view-container .landing-view").length).toEqual(1);
	});
	it("passes the parameter to the view function", () => {
		spyOn(learnjs, "problemView");
		learnjs.showView("#problem-2");
		expect(learnjs.problemView).toHaveBeenCalledWith(2);
	});
	it("invokes the router when loaded", () => {
		spyOn(learnjs, "showView");
		learnjs.appOnReady();
		expect(learnjs.showView).toHaveBeenCalledWith(window.location.hash);
	});
	it("subscribes to the hash change event", () => {
		learnjs.appOnReady();
		spyOn(learnjs, "showView");
		$(window).trigger("hashchange");
		expect(learnjs.showView).toHaveBeenCalledWith(window.location.hash);
	});

	describe("problem view", () => {
		let view;

		beforeEach(() => {
			view = learnjs.problemView("1");
		});

		it("has a title that shows the problem number", () => {
			expect(view.text().trim()).toContain("Problem #1");
		});
		describe("answer section", () => {
			it("can check a correct answer by hitting a button", () => {
				view.find(".answer").val("true");
				view.find(".check-btn").click();
				expect(view.find(".result").text()).toContain("Correct!");
			});
			it("can check an incorrect answer by hitting a button", () => {
				view.find(".answer").val("false");
				view.find(".check-btn").click();
				expect(view.find(".result").text()).toEqual("Incorrect!");
			});
		});
	});
});
