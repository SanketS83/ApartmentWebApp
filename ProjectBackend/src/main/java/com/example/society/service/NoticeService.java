package com.example.society.service;

import com.example.society.entity.Notice;
import com.example.society.exception.ResourceNotFoundException;
import com.example.society.repository.NoticeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoticeService {
    private final NoticeRepository noticeRepository;

    public NoticeService(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    public List<Notice> getAllNotices() {
        return noticeRepository.findAll();
    }

    public List<Notice> getActiveNotices() {
        return noticeRepository.findByIsActiveTrue();
    }

    public Notice getNoticeById(Long id) {
        return noticeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notice not found with id: " + id));
    }

    public Notice createNotice(Notice notice) {
        return noticeRepository.save(notice);
    }

    public Notice updateNotice(Long id, Notice noticeDetails) {
        Notice notice = getNoticeById(id);
        notice.setTitle(noticeDetails.getTitle());
        notice.setDescription(noticeDetails.getDescription());
        notice.setNoticeDate(noticeDetails.getNoticeDate());
        notice.setIsActive(noticeDetails.getIsActive());
        return noticeRepository.save(notice);
    }

    public void deleteNotice(Long id) {
        Notice notice = getNoticeById(id);
        noticeRepository.delete(notice);
    }
}
