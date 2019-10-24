import {JSDOM} from 'jsdom';
import { XrmMockGenerator } from "xrm-mock";
import assert from "assert";

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
    it('not null', ()=>{
      var ids = selector.parse('#firstname, #lastname');
      //console.log(ids);
      assert.notEqual(0, ids.length);
    })
  })
})