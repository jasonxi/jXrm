import {JSDOM} from 'jsdom';
import { XrmMockGenerator,  ClientContextMock, ContextMock, UserSettingsMock, UiMock, FormSelectorMock, ItemCollectionMock, FormItemMock, EntityMock } from "xrm-mock";
import assert from "assert";
import { before } from 'mocha';

describe("jXrm unit tests", ()=> {
  const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');
  //@ts-ignore
  global.window = dom.window;
  //@ts-ignore
  global.document = dom.window.document;
  
  XrmMockGenerator.initialise();

  require('../src/jxrm');
  //@ts-ignore
  var jXrm = window.jXrm;

  // Validate jXrm
  describe("Validate jXrm", () => {
    it("should not be undefined", () => {
      assert.notEqual(jXrm, undefined);
    })
    it("should not be Null", () => {
      assert.notEqual(jXrm, null);
    })
  });

  // // Xrm context
  // describe("Test Context values", ()  => {
  //   beforeEach(() => {
  //     const globalContext = new ContextMock(
  //       {
  //           clientContext: new ClientContextMock("Web", "Online"),
  //           clientUrl: "https://org.crm.dynamics.com/",
  //           currentTheme: "default",
  //           isAutoSaveEnabled: false,
  //           orgLcid: 1031,
  //           orgUniqueName: "Contoso",
  //           timeZoneOffset: 0,
  //           userId: "{B05EC7CE-5D51-DF11-97E0-00155DB232D0}",
  //           userLcid: 1033,
  //           userName: "Joe Bloggs",
  //           userRoles: ["cf4cc7ce-5d51-df11-97e0-00155db232d0"],
  //           userSettings: new UserSettingsMock(
  //               {
  //                   isGuidedHelpEnabled: false,
  //                   isHighContrastEnabled: false,
  //                   isRTL: false,
  //                   languageId: 1033,
  //                   securityRoles: ["cf4cc7ce-5d51-df11-97e0-00155db232d0"],
  //                   userId: "1337",
  //                   userName: "jdoe",
  //               }),
  //           version: "8.2.1.185",
  //       });
  //     XrmMockGenerator.initialise({
  //       context: globalContext,
  //       ui: new UiMock({
  //         formSelector: new FormSelectorMock(new ItemCollectionMock<FormItemMock>(
  //           [
  //             new FormItemMock({
  //               currentItem: true,
  //               formType: 2,
  //               id: '5',
  //               label: 'Main'
  //             })
  //           ]
  //         ))
  //       }),
  //       entity: new EntityMock({
  //         //attributes: new ItemCollectionMock<Xrm.Attributes.Attribute>([nameAttribute]),
  //         entityName: "account",
  //         id: "{00000000-0000-0000-0000-000000000000}"
  //       })
  //     });
  //   });
  //   describe("User context", () => {
  //     it('should match inital user data', () => {
  //       var userId = jXrm.context.userId;
  //       var userName = jXrm.context.userName;
  //       assert.equal(userId, Xrm.Page.context.getUserId());
  //       assert.equal(userName, Xrm.Page.context.getUserName());
  //     });
  //   });
  // });

  // Attribute functions
  describe("Test attribute functions", () => {
    beforeEach(() => {
      XrmMockGenerator.Attribute.createString("firstname", "Joe");
      XrmMockGenerator.Attribute.createString("lastname", "Dole");
      XrmMockGenerator.Attribute.createDate("dob", new Date());
    });

    describe("Get value", () => {
      it("should get value Joe", ()=> {
        // let name = Xrm.Page.getAttribute("firstname").getValue();
        let name = jXrm('#firstname').val();
        assert.equal(name, "Joe");
      })
    });

    describe("Set value", () => {
      it('should set value to Mark', () => {
        jXrm('#firstname').val('Mark');
        let name = jXrm('#firstname').val();
        assert.equal(name, 'Mark');
      });
      it('should set value to Null', () => {
        jXrm('#firstname').val(null);
        let name = jXrm('#firstname').val();
        assert.equal(name, null);
      })
    });

    describe("Nested calls", () => {
      it('should get value Joe', () => {
        jXrm('#firstname').val('Joe');
        jXrm('#lastname').val('Dole');
        jXrm('#lastname').val(jXrm('#firstname').val() + "1");
        let name = jXrm('#lastname').val();
        console.log('First Name:' + jXrm('#firstname').val());
        console.log('Last Name:' + name);
        assert.equal(name, 'Joe1');
        assert.equal(jXrm('#firstname').val(), 'Joe');
      })
    });

    describe("Get multi values", ()=> {
      it("should get value Joe Dole", ()=> {
        jXrm('#firstname').val('Joe');
        jXrm('#lastname').val('Dole');
        let names = jXrm('#firstname, #lastname').val();
        assert.equal(names.firstname, "Joe");
        assert.equal(names.lastname, "Dole");
      })
    });

    describe("Set multi values", () => {
      it("should set values to null", ()=> {
        let names = jXrm('#firstname, #lastname').val(null).val();
        assert.equal(names.firstname, null);
        assert.equal(names.lastname, null);
      })
    });

    describe("Get attribute types", () => {
      it("should be string and datetime", ()=> {
        jXrm('#firstname').val('Joe');
        let types = jXrm('#firstname, #dob').getType();
        // console.log(types);
        assert.equal(types.firstname, 'string');
        assert.equal(types.dob, 'datetime');
      })
    });

    describe("Visibility", () => {
      it("should get visible", ()=> {
        let result = jXrm('#firstname').getVisible();
        assert.equal(result, true);
      });
      it("should hide attribute", ()=> {
        let result = jXrm('#dob').hide().getVisible();
        assert.equal(result, false);
      });
      it("should hide multiple attributes", ()=> {
        let result = jXrm('#firstname, #lastname').hide().getVisible();
        assert.equal(result.firstname, false);
        assert.equal(result.lastname, false);
      });
    });

    describe("Submit mode", () => {
      it("should be dirty", ()=> {
        let result = jXrm('#firstname').getSubmitMode();
        assert.equal(result, 'dirty');
      });
      it("should change to always", ()=> {
        let result = jXrm('#firstname').setSubmitMode(jXrm.enum.SubmitMode.Always).getSubmitMode();
        // console.log(result);
        assert.equal(result, 'always');
      });    
    });    

    describe("Requirement  level", () => {
      it("should be recommended", ()=> {
        jXrm('#firstname').recommended();
//        assert.equal(result, 'dirty');
      })   
    });    

    // describe("Readonly", () => {
    //   it("should be readonly", ()=> {
    //     jXrm('#firstname').disable();
    //   })
    // })
    describe("Is Dirty", () => {
      it("should be false", ()=> {
        let result = jXrm('#dob').isDirty();
        //console.log(result);
        assert.equal(result, false);
      });
      it("should be dirty now", ()=> {
        let result = jXrm('#dob').val(new Date()).isDirty();
        //console.log(result);
        assert.equal(result, true);
      });    
    });   
  });

  // Selector tests
  describe("Test selector functions", ()=> {
    var selector = require('../src/scripts/selector');
    it('capture attributes', ()=>{
      var ids = selector.parse('#firstname, #lastname');
      //console.log(ids);
      assert.equal(2, ids.length);
      assert.equal('ID', ids[0].type);
      assert.equal('firstname', ids[0].id);
      assert.equal('ID', ids[1].type);
      assert.equal('lastname', ids[1].id);
    });

    it('capture sections', ()=>{
      var ids = selector.parse('Section #sec_id1, s #sec_id2, SEC #sec_id3');
      assert.equal(3, ids.length);
      assert.equal('SECTION', ids[0].type);
      assert.equal('sec_id1', ids[0].id);
      assert.equal('SECTION', ids[1].type);
      assert.equal('sec_id2', ids[1].id);
      assert.equal('SECTION', ids[2].type);
      assert.equal('sec_id3', ids[2].id);
    });

    it('capture tabs', ()=>{
      var ids = selector.parse('tab #tab1, t #tab2');
      assert.equal(2, ids.length);
      assert.equal('TAB', ids[0].type);
      assert.equal('tab1', ids[0].id);
      assert.equal('TAB', ids[1].type);
      assert.equal('tab2', ids[1].id);
    });
  })

  // Tab functions
  describe("Test tab functions", () => {
    before(() => {
      var sections = new ItemCollectionMock<Xrm.Controls.Section>([
          XrmMockGenerator.Section.createSection("sectionLogicalName", "Section Label", true, undefined, undefined)
      ]);
      XrmMockGenerator.Tab.createTab('tab_1', 'General', true, undefined, undefined, sections);
      XrmMockGenerator.Tab.createTab('tab_2', 'Tab 2', true, undefined, undefined, sections);
    });

    describe("Get tab Label", () => {
      it("should get tab", ()=> {
        let tab = jXrm('tab #tab_2');
        assert.equal(tab.getLabel(), 'Tab 2');
        assert.equal(tab.label, 'Tab 2');
      })
    });

    describe("Set tab Label", () => {
      it("should set tab label", ()=> {
        let tab1 = jXrm('tab #tab_1').setLabel('Tab 1 Changed');
        assert.equal(tab1.getLabel(), 'Tab 1 Changed');
        let tab2 = jXrm('tab #tab_2');
        tab2.label = 'Tab 2 Changed Again';
        assert.equal(tab2.label, 'Tab 2 Changed Again');
      });
    });

    describe("Set tab Display State", () => {
      it("should set tab state", ()=> {
        let tab = jXrm('tab #tab_2').setDisplayState('collapsed');
        assert.equal(tab.getDisplayState(), 'collapsed');
        
        tab = jXrm('tab #tab_2');
        tab.state = 'expanded';
        assert.equal(tab.state, 'expanded');
      });
    });

    describe("Set tab Visibility", () => {
      it("should set tab visibility", ()=> {
        let tab = jXrm('tab #tab_2').setVisible(false);
        assert.equal(tab.getVisible(), false);
        
        tab = jXrm('tab #tab_2');
        tab.visible = true;
        assert.equal(tab.visible, true);
      });
    });


  })

  // Section functions
  describe("Test section functions", () => {
    before(() => {
      var sections = new ItemCollectionMock<Xrm.Controls.Section>([
        XrmMockGenerator.Section.createSection("sec_1", "First Section Label", true, undefined, undefined),
        XrmMockGenerator.Section.createSection("sec_2", "Second Section Label", true, undefined, undefined),
      ]);
      XrmMockGenerator.Tab.createTab('tab_1', 'General', true, undefined, undefined, sections);
    });

    describe("Get section Label", () => {
      it("should get label", ()=> {
        let section = jXrm('section #sec_1');
        assert.equal(section.getLabel(), 'First Section Label');
        assert.equal(section.label, 'First Section Label');
      })
    });

    describe("Set section Label", () => {
      it("should set section label", ()=> {
        let section1 = jXrm('sec #sec_2').setLabel('Second Section Label 2');
        assert.equal(section1.getLabel(), 'Second Section Label 2');
        let section2 = jXrm('sec #sec_2');
        section2.label = 'Second Section Label 3';
        assert.equal(section2.label, 'Second Section Label 3');
      });
    });

    describe("Set section Visibility", () => {
      it("should set section visibility", ()=> {
        let section = jXrm('s #sec_2').setVisible(false);
        assert.equal(section.getVisible(), false);
        
        section = jXrm('s #sec_2');
        section.visible = true;
        assert.equal(section.visible, true);
      });
    });


  })
})