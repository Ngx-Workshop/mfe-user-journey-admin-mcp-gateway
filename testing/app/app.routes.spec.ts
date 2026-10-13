import { App } from '../../src/app/app';
import { Routes } from '../../src/app/app.routes';
import { oauth } from '../../src/app/features/mcp-console/api/oauth-api.service';

describe('MCP Gateway route contract', () => {
  it('opens overview by default and replaces the seed hello-world route', () => {
    expect(Routes.find((route) => route.path === '')).toEqual({
      path: '',
      redirectTo: 'overview',
      pathMatch: 'full',
    });
    expect(
      Routes.find((route) => route.path === 'overview')?.component
    ).toBe(App);
    expect(
      Routes.some((route) => route.path === 'hello-world')
    ).toBeFalse();
  });

  it('returns OAuth sign-in to the overview route', () => {
    expect(oauth.callback).toBe(
      'https://admin.ngx-workshop.io/mcp-gateway/overview'
    );
  });
});
