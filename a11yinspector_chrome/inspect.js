OpenAjax.a11y.CONSOLE_MESSAGES = false;

var summaryViewEnum = Object.freeze({
   CATEGORIES: 0,
   WCAG: 1
});
var viewStrings = [
   'SUMMARY',
   'LANDMARKS',
   'HEADINGS',
   'STYLES',
   'IMAGES',
   'LINKS',
   'TABLES',
   'FORMS',
   'WIDGETS',
   'MEDIA',
   'KEYBOARD',
   'TIMING',
   'NAVIGATION',
   'ALL RULES',
   'WCAG 1.1',
   'WCAG 1.2',
   'WCAG 1.3',
   'WCAG 1.4',
   'WCAG 2.1',
   'WCAG 2.2',
   'WCAG 2.3',
   'WCAG 2.4',
   'WCAG 3.1',
   'WCAG 3.2',
   'WCAG 3.3',
   'WCAG 4.1'
];


var a11yInspector = {
   evalFactory: OpenAjax.a11y.EvaluatorFactory.newInstance(),
   evaluator: null,
   evalResult: null,
   eventMode: 'none',
   bInitialized: false,
   bNewEval: false,
   doc: null,
   url: '',
   viewEnum: Object.freeze({
      SUMMARY:     0,
      LANDMARKS:   1,
      HEADINGS:    2,
      STYLES:      3,
      IMAGES:      4,
      LINKS:       5,
      TABLES:      6,
      FORMS:       7,
      WIDGETS:     8,
      MEDIA:       9,
      KEYBOARD:    10,
      TIMING:      11,
      NAVIGATION:  12,
      ALL_RULES:   13,
      WCAG_1_1:    14,
      WCAG_1_2:    15,
      WCAG_1_3:    16,
      WCAG_1_4:    17,
      WCAG_2_1:    18,
      WCAG_2_2:    19,
      WCAG_2_3:    20,
      WCAG_2_4:    21,
      WCAG_3_1:    22,
      WCAG_3_2:    23,    
      WCAG_3_3:    24,
      WCAG_4_1:    25
   }),
   numViews: 26,
   summaryEnum: Object.freeze({
      'Violations': 0,
      'Warnings': 1,
      'Manual Checks': 2,
      'Passes': 3,
      'N/A': 4
   }),
   $summaryViews: jQuery(),
   bShowViolations: true,
   bShowWarnings: true,
   bShowManualChecks: true,
   keys: {
      tab: 9,
      enter: 13,
      esc: 27,
      space: 32,
      left: 37,
      up: 38,
      right: 39,
      down: 40
   }
};

a11yInspector.init = function() {

   var thisObj = this;

   // Get document info from browser context
   this.doc = window.document;
   this.url = window.location.href;
   this.viewSize = {
      height: jQuery(window).height(),
      width: jQuery(window).width()
   };

   // Configure evaluator parameters
   this.evalFactory.setParameter('ruleset', OpenAjax.a11y.RulesetManager.getRuleset('ARIA_STRICT'));
   this.evalFactory.setFeature('eventProcessing', this.eventMode);
   this.evalFactory.setFeature('brokenLinkTesting', false);

   // Get the evaluator
   this.evaluator = this.evalFactory.newEvaluator();

   this.bInitialized = true;

   window.scrollTo(0,0);
   this.evaluate();
   this.buildPanel();
  
   // Add and event handler to detect window resize
   jQuery(window).on('resize.a11y', function() {
      thisObj.handleResize();
      return true;
   })
   .on('scroll', function(e) {
      thisObj.handleResize();
      return true;
   });
};

a11yInspector.evaluate = function() {
   this.evalResult = a11yInspector.evaluator.evaluate(this.doc, this.doc.title, this.url);
   this.bNewEval = true;
   this.storeResultsByGroup();
};

a11yInspector.storeResultsByGroup = function() {
   var view = this.viewEnum;
   var numViews = this.numViews;
   var evalResult = this.evalResult;

   this.groupResults = new Array(numViews);

   for (var ndx = 0; ndx < numViews; ndx++) {
      var groupConst = this.getRuleGroupConst(ndx);

      this.groupResults[ndx] = (ndx > view.ALL_RULES) ?
         evalResult.getRuleResultsByGuideline(groupConst) :
         evalResult.getRuleResultsByCategory(groupConst);
   }

};

a11yInspector.getRuleGroupConst = function (viewIndex) {
  var view = this.viewEnum;

  switch (viewIndex) {
      case view.SUMMARY: {
        return OpenAjax.a11y.RULE_CATEGORIES.ALL;
      }
      case view.LANDMARKS: {
        return OpenAjax.a11y.RULE_CATEGORIES.LANDMARKS;
      }
      case view.HEADINGS: {
        return OpenAjax.a11y.RULE_CATEGORIES.HEADINGS;
      }
      case view.STYLES: {
        return OpenAjax.a11y.RULE_CATEGORIES.STYLES_READABILITY;
      }
      case view.IMAGES: {
        return OpenAjax.a11y.RULE_CATEGORIES.IMAGES;
      }
      case view.LINKS: {
        return OpenAjax.a11y.RULE_CATEGORIES.LINKS;
      }
      case view.TABLES: {
        return OpenAjax.a11y.RULE_CATEGORIES.TABLES;
      }
      case view.FORMS: {
        return OpenAjax.a11y.RULE_CATEGORIES.FORMS;
      }
      case view.WIDGETS: {
        return OpenAjax.a11y.RULE_CATEGORIES.WIDGETS_SCRIPTS;
      }
      case view.MEDIA: {
        return OpenAjax.a11y.RULE_CATEGORIES.AUDIO_VIDEO;
      }
      case view.KEYBOARD: {
        return OpenAjax.a11y.RULE_CATEGORIES.KEYBOARD_SUPPORT;
      }
      case view.TIMING: {
        return OpenAjax.a11y.RULE_CATEGORIES.TIMING;
      }
      case view.NAVIGATION: {
        return OpenAjax.a11y.RULE_CATEGORIES.SITE_NAVIGATION;
      }
      case view.ALL_RULES: {
        return OpenAjax.a11y.RULE_CATEGORIES.ALL;
      }
      case view.WCAG_1_1: {
        return OpenAjax.a11y.WCAG20_GUIDELINE.G_1_1;
      }
      case view.WCAG_1_2: {
        return OpenAjax.a11y.WCAG20_GUIDELINE.G_1_2;
      }
      case view.WCAG_1_3: {
        return OpenAjax.a11y.WCAG20_GUIDELINE.G_1_3;
      }
      case view.WCAG_1_4: {
        return OpenAjax.a11y.WCAG20_GUIDELINE.G_1_4;
      }
      case view.WCAG_2_1: {
        return OpenAjax.a11y.WCAG20_GUIDELINE.G_2_1;
      }
      case view.WCAG_2_2: {
        return OpenAjax.a11y.WCAG20_GUIDELINE.G_2_2;
      }
      case view.WCAG_2_3: {
        return OpenAjax.a11y.WCAG20_GUIDELINE.G_2_3;
      }
      case view.WCAG_2_4: {
        return OpenAjax.a11y.WCAG20_GUIDELINE.G_2_4;
      }
      case view.WCAG_3_1: {
        return OpenAjax.a11y.WCAG20_GUIDELINE.G_3_1;
      }
      case view.WCAG_3_2: {
        return OpenAjax.a11y.WCAG20_GUIDELINE.G_3_2;
      }
      case view.WCAG_3_3: {
        return OpenAjax.a11y.WCAG20_GUIDELINE.G_3_3;
     }
      case view.WCAG_4_1: {
        return OpenAjax.a11y.WCAG20_GUIDELINE.G_4_1;
     }
  }

  return 0;
};

a11yInspector.buildPanel = function () {
   var thisObj = this;

   this.$panel = jQuery('<div>')
      .attr({
         'id': 'a11y-panel',
         'role': 'dialog',
         'aria-label': 'a11y inspector',
         'tabindex': '0'
      })
      .css('top', (jQuery(document).scrollTop() + 10) + 'px');

   this.$title = jQuery('<h2>')
      .text('a11yINSPECTOR')
      .addClass('a11y-title')
      .appendTo(this.$panel)
      .on('mousedown', function(e) {
         thisObj.clickPos = {
            x: e.pageX - thisObj.$panel.offset().left,
            y: e.pageY - thisObj.$panel.offset().top
         };

         jQuery(document).on('mousemove.a11y', function(e) {
            thisObj.handleDrag(e);
            return false;
         })
         .on('mouseup.a11y', function() {
            jQuery(document).off('mousemove.a11y');
            return false;
         });

         return false;
      });


   this.$bnClose = jQuery('<div>')
      .attr({
         'role': 'button',
         'aria-label': 'Dismiss',
         'tabindex': '0'
      })
      .addClass('a11y-close')
      .appendTo(this.$panel)
      .on('click', function() {
         thisObj.destroyPanel();
         return false;
      })
      .on('keydown', function() {
         if (e.which === thisObj.keys.enter || e.which === thisObj.keys.space) {
            thisObj.destroyPanel();
            return false;
         }
         return true;
      });

   this.addFilterButtonsToPanel();
   this.buildSummaryTabpanel();

   this.$elementResultsPanel = jQuery('<div>')
      .attr({
         'role': 'region',
         'aria-label': 'Element Results',
         'aria-hidden': 'true',
         'id': 'a11y-elementresults'
      })
      .addClass('a11y-results-panel')
      .appendTo(this.$panel);

   jQuery('body').prepend(this.$panel)

   this.$hlContainer = jQuery('<div>')
      .attr('id', 'a11y-hlcontainer');

   jQuery('body').prepend(this.$hlContainer);
};
a11yInspector.destroyPanel = function() {
   this.$panel.remove();
   this.$hlContainer.remove();
   this.$hlContainer = jQuery();
   this.$panel = jQuery();
   this.$title = jQuery();
   this.$bnClose = jQuery();
   this.$summary = jQuery();
   this.$filters = jQuery();
   this.$summaryTablist = jQuery();
   this.$summaryTabs = jQuery();
   this.$summaryPanels = jQuery();
   this.$summaryViews = jQuery();
   this.bShowViolations = true;
   this.bShowWarnings = true;
   this.bShowManualChecks = true;
};

a11yInspector.addFilterButtonsToPanel = function () {
   var evalSummary = this.groupResults[0].rule_results_summary;
   var thisObj = this;

   this.$summary = jQuery('<div>')
      .attr({
         'role': 'menubar',
         'aria-label': 'Result Filter'
      })
      .addClass('a11y-summary');

   this.$filters = jQuery('<div>')
      .attr({
         'role': 'menuitemcheckbox',
         'tabindex': '0',
         'aria-checked': 'true'
      })
      .addClass('a11y-filter-button a11y-filter-violations')
      .html('Violations: <br>' + evalSummary.violations)
      .appendTo(this.$summary)
      .on('click', function() {
         thisObj.toggleChecked(jQuery(this));
         thisObj.bShowViolations = !thisObj.bShowViolations;
         thisObj.populateSummary();
         return false;
      })
      .on('keydown', function(e) {
         if (e.which === thisObj.keys.enter || e.which === thisObj.keys.space) {
            thisObj.toggleChecked(jQuery(this));
            thisObj.bShowViolations = !thisObj.bShowViolations;
            thisObj.populateSummary();
            return false;
         }
         return true;
      });


   var $btn = jQuery('<div>')
      .attr({
         'role': 'menuitemcheckbox',
         'tabindex': '0',
         'aria-checked': 'true'
      })
      .addClass('a11y-filter-button a11y-filter-warnings')
      .html('Warnings: <br>' + evalSummary.warnings)
      .appendTo(this.$summary)
      .on('click', function() {
         thisObj.toggleChecked(jQuery(this));
         thisObj.bShowWarnings = !thisObj.bShowWarnings;
         thisObj.populateSummary();
         return false;
      })
      .on('keydown', function(e) {
         if (e.which === thisObj.keys.enter || e.which === thisObj.keys.space) {
            thisObj.toggleChecked(jQuery(this));
            thisObj.bShowWarnings = !thisObj.bShowWarnings;
            thisObj.populateSummary();
            return false;
         }
         return true;
      });

   this.$filters = this.$filters.add($btn);

   $btn = jQuery('<div>')
      .attr({
         'role': 'menuitemcheckbox',
         'tabindex': '0',
         'aria-checked': 'true'
      })
      .addClass('a11y-filter-button a11y-filter-manualchecks')
      .html('Manual Checks: <br>' + evalSummary.manual_checks)
      .appendTo(this.$summary)
      .on('click', function() {
         thisObj.toggleChecked(jQuery(this));
         thisObj.bShowManualChecks = !thisObj.bShowManualChecks;
         thisObj.populateSummary();
         return false;
      })
      .on('keydown', function(e) {
         if (e.which === thisObj.keys.enter || e.which === thisObj.keys.space) {
            thisObj.toggleChecked(jQuery(this));
            thisObj.bShowManualChecks = !thisObj.bShowManualChecks;
            thisObj.populateSummary();
            return false;
         }
         return true;
      });

   this.$filters = this.$filters.add($btn);

   this.$panel.append(this.$summary);
};

a11yInspector.buildSummaryTabpanel = function() {
   var thisObj = this;

   this.$summaryTablist = jQuery('<ul>')
      .attr({
         'role': 'tablist',
         'aria-label': 'Summary View'
      })
      .addClass('a11y-viewtabs');

   this.$summaryTabs = jQuery('<li>')
      .attr({
         'role': 'tab',
         'aria-selected': 'true',
         'aria-controls': 'a11y-category-panel',
         'tabindex': '0'
      })
      .text('Categories')
      .addClass('a11y-summary-tab');

   var $tab = jQuery('<li>')
      .attr({
         'role': 'tab',
         'aria-selected': 'false',
         'aria-controls': 'a11y-wcag-panel',
         'tabindex': '-1'
      })
      .text('WCAG 2.0')
      .addClass('a11y-summary-tab');

   this.$summaryTabs = this.$summaryTabs.add($tab);

   // Add event handlers
   this.$summaryTabs.on('click', function() {
      thisObj.selectTab(jQuery(this));
      return false;
   })
   .on('keydown', function(e) {
      switch(e.which) {
         case thisObj.keys.left: {
            thisObj.moveToPrevTab(thisObj.$summaryTabs, jQuery(this));
            return false;
         }
         case thisObj.keys.right: {
            thisObj.moveToNextTab(thisObj.$summaryTabs, jQuery(this));
            return false;
         }
      }

      return true;
   });

   this.$summaryTablist.append(this.$summaryTabs);
   this.$panel.append(this.$summaryTablist);

   this.$summaryPanels = jQuery('<div>')
      .attr({
         'role': 'tabpanel',
         'id': 'a11y-category-panel',
         'aria-hidden': 'false'
      })
      .addClass('a11y-results-panel');

   var $panel = jQuery('<div>')
      .attr({
         'role': 'tabpanel',
         'id': 'a11y-wcag-panel',
         'aria-hidden': 'true'
      })
      .addClass('a11y-results-panel');

   this.$summaryPanels = this.$summaryPanels.add($panel);


   this.populateSummary();

   this.$panel.append(this.$summaryPanels);
};

a11yInspector.populateSummary = function() {
   var thisObj = this;
   var $view;
   var bWCAG = false;

   if (!this.$summaryViews.length) {
      this.$summaryViews = jQuery('<ul>')
         .attr({
            'role': 'group',
            'aria-label': 'Category List'
         })
         .addClass('a11y-summary-list');

      $view = jQuery('<ul>')
         .attr({
            'role': 'group',
            'aria-label': 'WCAG List'
         })
         .addClass('a11y-summary-list');

      this.$summaryViews = this.$summaryViews.add($view);

      this.$summaryPanels.eq(0).append(this.$summaryViews.eq(summaryViewEnum.CATEGORIES));
      this.$summaryPanels.eq(1).append(this.$summaryViews.eq(summaryViewEnum.WCAG));
   }
   else {
      // we are repopulating the views - empty the lists
      this.$summaryViews.empty();
   }

   // reuse view to point to the first view list
   $view = this.$summaryViews.eq(summaryViewEnum.CATEGORIES);

   for (var ndx = 1; ndx < this.numViews; ndx++) {

      if (ndx === this.viewEnum.ALL_RULES) {
         // skip the ALL RULES category
         continue;
      }

      var resultCount = {
         v: this.groupResults[ndx].rule_results_summary.violations,
         w: this.groupResults[ndx].rule_results_summary.warnings,
         mc: this.groupResults[ndx].rule_results_summary.manual_checks
      };

      if ((resultCount.v + resultCount.w + resultCount.mc) === 0) {
         // category has no results - skip it
         continue;
      }

      if (!( (resultCount.v && this.bShowViolations) ||
         (resultCount.w && this.bShowWarnings) ||
         (resultCount.mc && this.bShowManualChecks) )) {
            continue;
         }

      if (ndx > this.viewEnum.ALL_RULES) {
         // WCAG rule groups follow category groups
         $view = this.$summaryViews.eq(summaryViewEnum.WCAG);
         bWCAG = true;
      }

      var $li = jQuery('<li>')
         .attr('role', 'presentation')
         .addClass('a11y-summarylist-accordian');

      var $heading = jQuery('<h3>');

      $li.append($heading);

      var $accordian = jQuery('<div>')
         .attr({
            'role': 'button',
            'id': 'accordian-' + ndx,
            'aria-expanded': 'false',
            'aria-controls': 'a11y-summary-accordian-panel' + ndx,
            'aria-describedby': 'a11y-result-totals-' + ndx,
            'tabindex': '0'
         })
         .addClass('a11y-summarylist-button')
         .text(this.groupResults[ndx].rule_group_information.title) // retrieve title from OAA library
         .on('click', function() {
            thisObj.toggleAccordian(jQuery(this));
            return false;
         })
         .on('keydown', function(e) {
            return thisObj.handleAccordianKeydown(e);
         });

      $heading.append($accordian);


      // Create and add result totals to the category heading
      var $totals = jQuery('<ul>')
         .attr('id', 'a11y-result-totals-' + ndx);

      var $totalLI;

      if (this.bShowViolations) {
         $totalLI = jQuery('<li>')
            .html('<span aria-label="' + resultCount.v + ' violation' + ((resultCount.v !== 1) ? 's' : '') + '.">V: ' + resultCount.v + '</span>')
            .addClass('a11y-total-violations');
         $totals.append($totalLI);
      }

      if (this.bShowWarnings) {
         $totalLI = jQuery('<li>')
            .html('<span aria-label="' + resultCount.w + ' warning' + ((resultCount.w !== 1) ? 's' : '') + '.">W: ' + resultCount.w + '</span>')
            .addClass('a11y-total-warnings');
         $totals.append($totalLI);
      }

      if (this.bShowManualChecks) {
         $totalLI = jQuery('<li>')
            .html('<span aria-label="' + resultCount.mc + ' manual checks' + ((resultCount.mc !== 1) ? 's' : '') + '.">MC: ' + resultCount.mc + '</span>')
            .addClass('a11y-total-manualchecks');
         $totals.append($totalLI);
      }

      $li.append($totals);

      // Add arrows to the heading as a visual cue that it is expandable
      var $arrow = jQuery('<div>').addClass('a11y-expand-arrow');
      $accordian.append($arrow);


      // Create and add the accordian panel for this category
      var $panelOuter = jQuery('<div>').attr('role', 'document');

      var $panel = jQuery('<div>')
         .attr({
            'role': 'region',
            'id': 'a11y-summary-accordian-panel' + ndx,
            'aria-labelledby': $accordian.attr('id'),
            'aria-hidden': 'true',
            'tabindex': '0'
         })
         .addClass('a11y-summarylist-panel')
         .appendTo($panelOuter);

      thisObj.populateResults(ndx, $panel, bWCAG);


      $li.append($panelOuter);

      // Insert the accordian into the interface
      $view.append($li);
   }

};
/*******
 * Function: populateResults()
 * Params:
 *    group: the index of the current rule result group
 *    $panel: The accordian panel to populate
 */
a11yInspector.populateResults = function(groupNdx, $panel, bWCAG) {
   var thisObj = this;
   var results = this.groupResults[groupNdx];

   var $resultsWrap = jQuery('<div>')
      .attr('id', 'a11y-ruleresults-' + groupNdx)
      .addClass('a11y-results');

   var $desc = jQuery('<p>')
      .addClass('a11y-results-desc')
      .text(results.rule_group_information.description);


   $resultsWrap.append('<p id="a11y-results-cue">Click on a rule to view element results.</p>');

   var $table = jQuery('<table>')
      .attr({
         'role': 'grid',
         'aria-readonly': 'true'
      })
      .addClass('a11y-results-table')
      .html('<caption>Rule Results</caption><thead><tr><th>Rule</th><th>Type</th></tr></thead><tbody>');

   for (var ndx = 0; ndx < results.rule_results.length; ndx++) {
      var rule = results.rule_results[ndx];
      var resultVal = OpenAjax.a11y.RULE_RESULT_VALUE;
      var ruleType = rule.getResultValue();

      if (!rule.element_results_summary.violations &&
         !rule.element_results_summary.warnings &&
         !rule.element_results_summary.manual_checks)
      {
         // Skip any result that is not a violation, warning or manual check
         continue;
      }

      if (((ruleType === resultVal.VIOLATION) && !this.bShowViolations) ||
         ((ruleType === resultVal.WARNING) && !this.bShowWarnings) ||
         ((ruleType === resultVal.MANUAL_CHECK) && !this.bShowManualChecks)
      ) {
         // Skips any results that are filtered out
         continue;
      }

      var $tr = jQuery('<tr>');

      var $td = jQuery('<td>')
         .attr({
            'role': 'gridcell',
            'aria-expanded': 'false',
            'aria-controls': (!bWCAG ? 'a11y-category-panel' : 'a11y-wcag-panel') + ' a11y-elementresults',
            'tabindex': '0',
            'data-rulendx': ndx
         })
         .text(rule.getRuleSummary())
         .appendTo($tr)
         .on('click', function() {
            var ruleNdx = jQuery(this).data('rulendx');
            thisObj.showElementResults(jQuery(this), results.rule_results[ruleNdx]);
            return false;
         })
         .on('keydown', function(e) {
            switch (e.which) {
                  case thisObj.keys.enter:
                  case thisObj.keys.space: {
                     var ruleNdx = jQuery(this).data('rulendx');
                     thisObj.showElementResults(jQuery(this), results.rule_results[ruleNdx]);
                     return false;
                  }
            }
            return true;
         });

      $td = jQuery('<td>')
         .attr({
            'role': 'gridcell',
            'tabindex': '-1'
         });

      if (ruleType === resultVal.VIOLATION) {
         $td.html('<span aria-label="Violation">V</span>');
      }
      else if (ruleType === resultVal.WARNING) {
         $td.html('<span aria-label="Warning">W</span>');
      }
      else {
         $td.html('<span aria-label="Manual Check">MC</span>');
      }

      $td.appendTo($tr);
      $table.append($tr);

   }

   $table.append('</tbody>');


   $resultsWrap.append($table);

   $resultsWrap.append('<h4 class="a11y-results-heading">Description</h4>');
   $resultsWrap.append($desc);

   $panel.append($resultsWrap);

};

/*******
 * Tab Control functions
 */
a11yInspector.moveToNextTab = function($tablist, $tab) {
   if ($tablist.index($tab) < $tablist.length) {
      this.selectTab($tab.next());
   }
};
a11yInspector.moveToPrevTab = function($tablist, $tab) {
   if ($tablist.index($tab) > 0) {
      this.selectTab($tab.prev());
   }
};
a11yInspector.selectTab = function($tab) {
   var $siblings = $tab.siblings();

   $siblings.attr({
      'aria-selected': 'false',
      'tabindex': '-1'
      })
      .each(function() {
         jQuery('#' + jQuery(this).attr('aria-controls')).attr('aria-hidden', 'true');
      });

   jQuery('#' + $tab.attr('aria-controls')).attr('aria-hidden', 'false');
   $tab.attr({
      'aria-selected': 'true',
      'tabindex': '0'
      }).focus();
};
/**********
 * Accordian control functions
 */
a11yInspector.closeAccordian = function($accordian) {
      $accordian.attr('aria-expanded', 'false');
      jQuery('#' + $accordian.attr('aria-controls')).attr('aria-hidden', 'true');
};
a11yInspector.openAccordian = function($accordian) {
      $accordian.attr('aria-expanded', 'true');
      jQuery('#' + $accordian.attr('aria-controls')).attr('aria-hidden', 'false');
};
a11yInspector.toggleAccordian = function($accordian) {
   var $siblings = $accordian.parentsUntil('ul').last().parent().find('.a11y-summarylist-button').not($accordian);
   var thisObj = this;

   $siblings.each(function() {
      var $btn = jQuery(this);

      thisObj.closeAccordian($btn);
   });

   if ($accordian.attr('aria-expanded') === 'false') {
      this.openAccordian($accordian);
   }
   else {
      this.closeAccordian($accordian);
   }
   
};
a11yInspector.handleAccordianKeydown = function(e) {
   var $btn = jQuery(e.target);
   var $newBtn;
   var $accordians = $btn.parentsUntil('ul').last().parent().find('.a11y-summarylist-button');
   var btnIndex = $accordians.index($btn);

   switch (e.which) {
      case this.keys.enter:
      case this.keys.space: {
         this.toggleAccordian($btn);
         return false;
      }
      case this.keys.down: {
         if (btnIndex < $accordians.length) {
            $newBtn = $accordians.eq(btnIndex+1);
            $newBtn.focus();
         }
         return false;
      }
      case this.keys.up: {
         if (btnIndex > 0) {
            $newBtn = $accordians.eq(btnIndex-1);
            $newBtn.focus();
         }
         return false;
      }
   }

   return true;
};
/**********
 * Element Results Functions
 */
a11yInspector.showElementResults = function($trigger, rule) {

   var $controls = $trigger.attr('aria-controls').split(' ');
   var $rulesPanel = jQuery('#' + $controls[0]);
   var $elementPanel = jQuery('#' + $controls[1]);

   this.populateElementResults($elementPanel, $rulesPanel, $trigger, rule);

   $rulesPanel.attr('aria-hidden', 'true');
   $elementPanel.attr('aria-hidden', 'false');

   // set focus on the back button of the element results panel
   $elementPanel.find('.a11y-backbtn').focus();
};

a11yInspector.hideElementResults = function($elementPanel, $rulesPanel, $trigger) {
   $rulesPanel.attr('aria-hidden', 'false');
   $elementPanel.attr('aria-hidden', 'true').empty();

   // set focus on the rule item in the category grid
   $trigger.focus();
};

a11yInspector.populateElementResults = function($elementPanel, $rulesPanel, $trigger, rule) {
   var thisObj = this;
   var resultVal = OpenAjax.a11y.RULE_RESULT_VALUE;
   var ruleType = rule.getResultValue();
   var ruleObj;

   if (ruleType === resultVal.VIOLATION) {
      ruleTypeVal = 'V';
   }
   else if (ruleType === resultVal.WARNING) {
      ruleTypeVal = 'W';
   }
   else {
      ruleTypeVal = 'MC';
   }

   var $backBtn = jQuery('<div>')
      .addClass('a11y-backbtn')
      .attr({
         'role': 'button',
         'tabindex': 0,
         'title': 'Back to rule results',
         'aria-label': 'Back to rule results'
      })
      .text('<<')
      .on('click', function() {
         thisObj.hideElementResults($elementPanel, $rulesPanel, $trigger);
         return false;
      })
      .on('keydown', function(e) {
         switch (e.which) {
            case thisObj.keys.enter:
            case thisObj.keys.space: {
               thisObj.hideElementResults($elementPanel, $rulesPanel, $trigger);
               return false;
            }
         }
         return true;
      })
      .appendTo($elementPanel);

   $elementPanel.append('<h4 id="a11y-elementresults-hdg' + $trigger.data('rulendx') + '" class="a11y-elementhdg">' + $trigger.text() + ' (' + ruleTypeVal + ')</h4>');

   switch (ruleType) {
      case resultVal.VIOLATION: {
         ruleObj = rule.element_results_violations;
         break;
      }
      case resultVal.WARNING: {
         ruleObj = rule.element_results_warnings;
         break;
      }
      case resultVal.MANUAL_CHECK: {
         ruleObj = rule.element_results_manual_checks;
         break;
      }
   }

   var $resultsTable = jQuery('<table>')
      .attr({
         'role': 'grid',
         'aria-readonly': 'true'
      })
      .addClass('a11y-results-table')
      .html('<caption>Element Results</caption><thead><tr><th>Element</th><th><abbr title="Document Position">Pos</abbr></th><tbody>');

   for (var ndx = 0; ndx < ruleObj.length; ndx++) {
      var element = ruleObj[ndx];

      var $tr = jQuery('<tr>');
      /*
      var styleFunc = element.cache_item.getStyle;

      if (!styleFunc) {
         styleFunc = element.cache_item.dom_element.getStyle;
      }
      */

      var $td = jQuery('<td>')
         .attr({
            'role': 'gridcell',
            //'aria-controls': 'a11y-ruleresults-' + groupNdx + ' a11y-elementresults-' + groupNdx,
            'tabindex': '0',
            'title': element.element_identifier,
         })
         .data('elem', element.getDOMElement())
         .text(element.element_identifier)
         .appendTo($tr)
         .on('click', function() {

            thisObj.handleOverlay(jQuery(this));
            return false;
         })
         .on('keydown', function(e) {
            switch (e.which) {
               case thisObj.keys.enter:
               case thisObj.keys.space: {
                  thisObj.handleOverlay(jQuery(this));
                  return false;
               }
            }
            return true;
         });

      $td = jQuery('<td>')
         .attr({
            'role': 'gridcell',
            'tabindex': '-1'
         })
         .text(element.getOrdinalPosition())
         .appendTo($tr);

      $resultsTable.append($tr);
   }

   $resultsTable.append('</tbody>');
   $elementPanel.append($resultsTable);
};

a11yInspector.handleOverlay = function($elem) {

   var dom_element = $elem.data('elem');
   var style = dom_element.computed_style;
   var VISIBILITY = OpenAjax.a11y.VISIBILITY;
   var scrollTop = jQuery(document).scrollTop();

   if (dom_element.node) {
      switch (style.is_visible_onscreen) {
         case VISIBILITY.VISIBLE: {
            break;
         }
         case VISIBILITY.HIDDEN: {
            // TO DO: Create an overlay for hidden items
            return;
         }
         case VISIBILITY.UNKNOWN: {
            return;
         }
      }
   }
   else {
      console.log('no node');
   }

   var elemTop = style.top;
   var elemLeft = style.left;
   var elemWidth = style.width;
   var elemHeight = style.height;

   this.$hlContainer.empty();

   $hl = jQuery('<div>')
      .addClass('a11y-elem-hl')
      .css({
         'top': elemTop + 'px',
         'left': elemLeft + 'px',
         'width': elemWidth  + 'px',
         'height': elemHeight + 'px'
      })
      .appendTo(this.$hlContainer);

   if ((elemTop < scrollTop) || ((elemTop + elemHeight) > (scrollTop + this.viewSize.height)) ) {
      window.scrollTo(elemLeft, elemTop);

      if ( (this.viewSize.height - elemTop) > this.$panel.height() ) {
         this.$panel.css('top', (elemTop + 10) + 'px');
      }
      else {
         this.$panel.css('top', (jQuery(document).scrollTop() + 10) + 'px');
      }
   }
};
a11yInspector.toggleChecked = function($btn) {
   if ($btn.attr('aria-checked') === 'true') {
      $btn.attr('aria-checked', 'false');
   }
   else {
      $btn.attr('aria-checked', 'true');
   }
};
a11yInspector.handleDrag = function(e) {

   var docScroll = {
      left: jQuery(document).scrollLeft(),
      top: jQuery(document).scrollTop()
   };

   var newPos = {
      x: e.pageX - this.clickPos.x,
      y: e.pageY - this.clickPos.y
   };

   if (newPos.x < (docScroll.left + 10)) {
      newPos.x = docScroll.leftx + 10;
   }
   else if (newPos.x > this.viewSize.width - this.$panel.width() - 10) {
      newPos.x = this.viewSize.width - this.$panel.width() - 10;
   }

   if (newPos.y < (docScroll.top + 10)) {
      newPos.y = docScroll.top + 10;
   }
   else if (newPos.y > (this.viewSize.height + docScroll.top - 50)) {
      newPos.y = this.viewSize.height + docScroll.top - 50;
   }

   this.$panel.css({
      'left': newPos.x + 'px',
      'top': newPos.y + 'px'
   });
};
a11yInspector.handleResize = function() {

   var docScroll = {
      left: jQuery(document).scrollLeft(),
      top: jQuery(document).scrollTop()
   };

   // redefine the stored viewSize
   this.viewSize = {
      width: jQuery(window).width(),
      height: jQuery(window).height()
   };

   // Check that the panel is still on screen
   var panelPos = {
      left: this.$panel.offset().left,
      top: this.$panel.offset().top
   };

   if ((panelPos.left - docScroll.left) > this.viewSize.width - this.$panel.width() - 10) {
      this.$panel.css('left','');
   }

   if (panelPos.top > (this.viewSize.height + docScroll.top - this.$panel.height() - 10)) {
      var newPos = docScroll.top + this.viewSize.height - this.$panel.height() - 10;

      if (newPos < docScroll.top + 10) {
         newPos = docScroll.top + 10;
      }

      this.$panel.css('top', newPos + 'px');

   }
   else if(panelPos.top < (docScroll.top + 10)) {
      this.$panel.css('top', (docScroll.top + 10) + 'px');
   }
};
