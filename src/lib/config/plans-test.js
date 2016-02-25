import Plan from './plan.js'

describe.only('plan', () => {

  describe('.all', () => {
    it(`finds all plans`, () => {
      expect(Plan.all().length).to.equal(6)
    })
  });

  describe('.find', () => {
    it(`finds correct plans`, () => {
      expect(Plan.find('personal_small').id).to.equal('personal_small')
    })
  });

  describe('#fullName', () => {
    it(`correctly returns full name`, () => {
      expect(Plan.find('personal_small').fullName()).to.equal('Small Plan')
    })
  });
})
