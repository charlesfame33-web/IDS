# -*- coding: utf-8 -*-
"""Generate system flowchart for mayor4code platform using matplotlib."""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.path import Path
import numpy as np


def _arrow(ax, x1, y1, x2, y2, color='#2563eb', lw=1.5):
    ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle='->', color=color, lw=lw))


def _box(ax, x, y, w, h, text, color='#1e293b', text_color='#ffffff', fontsize=8, bold=False):
    rect = mpatches.FancyBboxPatch((x - w / 2, y - h / 2), w, h,
                                    boxstyle="round,pad=0.1",
                                    facecolor=color, edgecolor='none', zorder=3)
    ax.add_patch(rect)
    ax.text(x, y, text, ha='center', va='center', fontsize=fontsize,
            color=text_color, fontweight='bold' if bold else 'normal', zorder=4)


def _diamond(ax, x, y, w, h, text, color='#f59e0b', text_color='#ffffff', fontsize=7):
    pts = np.array([[x, y + h / 2], [x + w / 2, y], [x, y - h / 2], [x - w / 2, y]])
    poly = mpatches.Polygon(pts, closed=True, facecolor=color, edgecolor='none', zorder=3)
    ax.add_patch(poly)
    ax.text(x, y, text, ha='center', va='center', fontsize=fontsize,
            color=text_color, fontweight='normal', zorder=4)


def generate(output_path):
    fig, ax = plt.subplots(1, 1, figsize=(6.5, 9))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 14)
    ax.axis('off')

    c_primary = '#2563eb'
    c_success = '#22c55e'
    c_warning = '#f59e0b'
    c_danger = '#ef4444'
    c_dark = '#1e293b'
    c_muted = '#64748b'
    c_white = '#ffffff'

    bw, bh = 2.4, 0.55

    # Positions (x, y)
    start = (5, 13.2)
    reg = (5, 11.7)
    dash = (5, 10.2)
    lesson = (5, 8.4)
    quiz = (5, 6.9)
    diamond = (5, 5.4)
    retry = (5, 3.9)
    next_lesson = (5, 2.7)
    cert = (5, 1.2)

    # Start
    _box(ax, start[0], start[1], bw * 0.8, bh * 0.7, 'Start', c_success, c_white, 9, bold=True)

    # User Registration / Login
    _box(ax, reg[0], reg[1], bw * 1.1, bh, 'User Registration\n/ Login', c_primary, c_white, 8)
    _arrow(ax, start[0], start[1] - bh * 0.35, reg[0], reg[1] + bh / 2 + 0.05, c_muted)

    # Dashboard
    _box(ax, dash[0], dash[1], bw * 0.9, bh, 'Dashboard', c_primary, c_white, 8)
    _arrow(ax, reg[0], reg[1] - bh / 2 - 0.05, dash[0], dash[1] + bh / 2 + 0.05, c_muted)

    # Study Lesson
    _box(ax, lesson[0], lesson[1], bw * 0.9, bh, 'Study Lesson', c_primary, c_white, 8)
    _arrow(ax, dash[0], dash[1] - bh / 2 - 0.05, lesson[0], lesson[1] + bh / 2 + 0.05, c_muted)

    # Take Quiz
    _box(ax, quiz[0], quiz[1], bw * 0.8, bh, 'Take Quiz', c_primary, c_white, 8)
    _arrow(ax, lesson[0], lesson[1] - bh / 2 - 0.05, quiz[0], quiz[1] + bh / 2 + 0.05, c_muted)

    # Pass >= 60%?
    _diamond(ax, diamond[0], diamond[1], bw * 1.2, bh * 1.2, 'Pass\n≥ 60%?', c_warning, c_white, 7)

    _arrow(ax, quiz[0], quiz[1] - bh / 2 - 0.05, diamond[0], diamond[1] + bh * 0.6 + 0.05, c_muted)

    # No branch
    _box(ax, retry[0], retry[1], bw * 0.8, bh * 0.7, 'Review &\nRetry', c_danger, c_white, 7)
    _arrow(ax, diamond[0] - bw * 0.6, diamond[1], diamond[0] - bw * 0.6 - 0.8, diamond[1],
           c_danger, lw=1)
    _arrow(ax, retry[0], retry[1] + bh * 0.35 + 0.05, retry[0], retry[1] + 1.0, c_danger, lw=1)
    ax.text(diamond[0] - bw * 0.6 + 0.1, diamond[1] + 0.3, 'No', fontsize=7, color=c_danger, ha='center')

    # Yes branch
    _arrow(ax, diamond[0], diamond[1] - bh * 0.6 - 0.05, next_lesson[0], next_lesson[1] + bh / 2 + 0.05,
           c_success)
    ax.text(next_lesson[0] + 0.3, diamond[1] - bh * 0.6 - 0.3, 'Yes', fontsize=7, color=c_success, ha='center')

    # Next Lesson / Certificate
    _box(ax, next_lesson[0], next_lesson[1], bw * 1.2, bh,
         'Next Lesson\nor Certificate', c_success, c_white, 7)
    _arrow(ax, next_lesson[0], next_lesson[1] - bh / 2 - 0.05, cert[0], cert[1] + bh / 2 + 0.05, c_muted)

    _box(ax, cert[0], cert[1], bw * 0.9, bh, 'Certificate\nIssued', c_success, c_white, 8, bold=True)

    # Playground accessible note
    ax.text(9.5, 1.5, 'Playground\naccessible\nanytime via\nsidebar', fontsize=6.5,
            color=c_muted, ha='right', va='top',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='#f1f5f9', edgecolor=c_muted, linewidth=0.5))

    # Arrow from playground note to lesson
    _arrow(ax, 9.3, 2.5, 9.3, lesson[1] + bh / 2, c_muted, lw=0.8)

    plt.tight_layout()
    fig.savefig(output_path, dpi=200, bbox_inches='tight', facecolor='#ffffff')
    plt.close(fig)
    print('saved', output_path)


if __name__ == '__main__':
    generate(r'c:\Users\ALEXIS\Desktop\SENPAI\shots\mayor4code\flowchart.png')
