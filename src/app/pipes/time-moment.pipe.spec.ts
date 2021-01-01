import { TimeMomentPipe } from './time-moment.pipe';

describe('TimeMomentPipe', () => {
  it('create an instance', () => {
    const pipe = new TimeMomentPipe();
    expect(pipe).toBeTruthy();
  });
});
