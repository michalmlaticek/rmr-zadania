import { MmDashboardPage } from './app.po';

describe('mm-dashboard App', function() {
  let page: MmDashboardPage;

  beforeEach(() => {
    page = new MmDashboardPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
