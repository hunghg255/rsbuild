import { createStubRsbuild } from '@scripts/test-helper';
import { initHooks } from '../src/initHooks';

describe('initHooks', () => {
  test('should init hooks correctly', async () => {
    const hooks = initHooks();
    expect(Object.keys(hooks)).toMatchSnapshot();
  });
});

describe('onExit hook', () => {
  test('should listen to process exit when calling api.onExit', async () => {
    const exitCbs: Array<(...args: any[]) => void> = [];
    const spy = vi.spyOn(process, 'on');
    spy.mockImplementation((event, cb) => {
      if (event === 'exit') {
        exitCbs.push(cb);
      }
      return process;
    });

    const onExit = vi.fn();
    const rsbuild = await createStubRsbuild({
      plugins: [
        {
          name: 'foo',
          setup(api) {
            api.onExit(onExit);
          },
        },
      ],
    });
    await rsbuild.unwrapConfig();

    for (const cb of exitCbs) {
      cb();
    }

    // wait exit async callback end
    await new Promise((resolve) => setTimeout(resolve));

    expect(onExit).toHaveBeenCalledTimes(1);
  });
});
