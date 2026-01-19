from collections import deque

class FrameAverager:
    def __init__(self, max_frames=30):
        self.max_frames = max_frames
        self.buffer = deque(maxlen=max_frames)

    def add(self, ratios):
        if ratios:
            self.buffer.append(ratios)

    def is_ready(self):
        return len(self.buffer) >= self.max_frames
    
    def average(self):
        if not self.buffer:
            return None
        
        avg = {}
        keys = self.buffer[0].keys()

        for k in keys:
            avg[k] = round(
                sum(frame[k] for frame in self.buffer) / len(self.buffer),
                3
            )

        return avg
    
    def reset(self):
        self.buffer.clear()