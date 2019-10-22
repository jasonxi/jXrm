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

  // Attribute functions
  describe("Test attribute functions", () => {
    beforeEach(() => {
      XrmMockGenerator.Attribute.createString("firstname", "Joe");
    });
    describe("Get value", () => {
      it("should get value Joe", ()=> {
        // let name = Xrm.Page.getAttribute("firstname").getValue();
        let name = jXrm('firstname').val();
        assert.equal(name, "Joe");
      })
    });

    describe("Set value", () => {
      it('should set value to Mark', () => {
        jXrm('firstname').val('Mark');
        let name = jXrm('firstname').val();
        assert.equal(name, 'Mark');
      });
      it('should set value to Null', () => {
        jXrm('firstname').val(null);
        let name = jXrm('firstname').val();
        assert.equal(name, null);
      })
    })
  });
})