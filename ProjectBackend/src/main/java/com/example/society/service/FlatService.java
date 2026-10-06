package com.example.society.service;

import com.example.society.entity.Flat;
import com.example.society.exception.ResourceNotFoundException;
import com.example.society.repository.FlatRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlatService {
    private final FlatRepository flatRepository;

    public FlatService(FlatRepository flatRepository) {
        this.flatRepository = flatRepository;
    }

    public List<Flat> getAllFlats() {
        return flatRepository.findAll();
    }

    public Flat getFlatById(Long id) {
        return flatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Flat not found with id: " + id));
    }

    public Flat createFlat(Flat flat) {
        return flatRepository.save(flat);
    }

    public Flat updateFlat(Long id, Flat flatDetails) {
        Flat flat = getFlatById(id);
        flat.setFlatNumber(flatDetails.getFlatNumber());
        flat.setBuilding(flatDetails.getBuilding());
        flat.setFloor(flatDetails.getFloor());
        flat.setFlatType(flatDetails.getFlatType());
        flat.setArea(flatDetails.getArea());
        flat.setStatus(flatDetails.getStatus());
        return flatRepository.save(flat);
    }

    public void deleteFlat(Long id) {
        Flat flat = getFlatById(id);
        flatRepository.delete(flat);
    }
}
